import { useLayoutEffect, useRef, useCallback } from 'react'
import Lenis from 'lenis'
import './ScrollStack.css'

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
)

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) => {
  const scrollerRef = useRef(null)
  const stackCompletedRef = useRef(false)
  const animationFrameRef = useRef(null)
  const lenisRef = useRef(null)
  const cardsRef = useRef([])
  const rafPendingRef = useRef(false)

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0
    if (scrollTop > end) return 1
    return (scrollTop - start) / (end - start)
  }, [])

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight
    }
    return parseFloat(value)
  }, [])

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      const vv = typeof window !== 'undefined' ? window.visualViewport : null
      return {
        scrollTop: window.scrollY ?? document.documentElement.scrollTop,
        containerHeight: vv?.height ?? window.innerHeight,
      }
    }

    const scroller = scrollerRef.current
    return {
      scrollTop: scroller.scrollTop,
      containerHeight: scroller.clientHeight,
    }
  }, [useWindowScroll])

  const getElementOffset = useCallback(
    (element) => {
      if (useWindowScroll) {
        // Use layout offsets instead of transformed rects to avoid
        // transform feedback jitter while cards animate.
        let current = element
        let offsetTop = 0
        while (current) {
          offsetTop += current.offsetTop || 0
          current = current.offsetParent
        }
        return offsetTop
      }
      return element.offsetTop
    },
    [useWindowScroll],
  )

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return

    const { scrollTop, containerHeight } = getScrollData()
    const stackPositionPx = parsePercentage(stackPosition, containerHeight)
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight)

    const endElement = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scrollerRef.current?.querySelector('.scroll-stack-end')

    const endElementTop = endElement ? getElementOffset(endElement) : 0

    cardsRef.current.forEach((card, i) => {
      if (!card) return

      const cardTop = getElementOffset(card)
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i
      const triggerEnd = cardTop - scaleEndPositionPx
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i
      const pinEnd = endElementTop - containerHeight / 2

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
      const targetScale = baseScale + i * itemScale
      const scale = 1 - scaleProgress * (1 - targetScale)
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

      let blur = 0
      if (blurAmount) {
        let topCardIndex = 0
        for (let j = 0; j < cardsRef.current.length; j += 1) {
          const jCardTop = getElementOffset(cardsRef.current[j])
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j
          if (scrollTop >= jTriggerStart) topCardIndex = j
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i
          blur = Math.max(0, depthInStack * blurAmount)
        }
      }

      let translateY = 0
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd
      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i
      }

      // Subpixel rounding keeps GPU work stable; dedupe avoids redundant writes when scroll is idle.
      const ty = Math.round(translateY * 1000) / 1000
      const sc = Math.round(scale * 10000) / 10000
      const rot = Math.round(rotation * 1000) / 1000
      const bl = Math.round(blur * 1000) / 1000

      const transformStr = `translate3d(0, ${ty}px, 0) scale(${sc}) rotate(${rot}deg)`
      const filterStr = bl > 0 ? `blur(${bl}px)` : ''
      if (card.dataset.stackTx !== transformStr) {
        card.dataset.stackTx = transformStr
        card.style.transform = transformStr
      }
      if (card.dataset.stackFl !== filterStr) {
        card.dataset.stackFl = filterStr
        card.style.filter = filterStr
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true
          onStackComplete?.()
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false
        }
      }
    })
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset,
  ])

  /** One transform update per animation frame — avoids jitter when Lenis emits many scroll events per frame. */
  const scheduleTransformUpdate = useCallback(() => {
    if (rafPendingRef.current) return
    rafPendingRef.current = true
    requestAnimationFrame(() => {
      rafPendingRef.current = false
      updateCardTransforms()
    })
  }, [updateCardTransforms])

  const handleScroll = useCallback(() => {
    scheduleTransformUpdate()
  }, [scheduleTransformUpdate])

  const setupLenis = useCallback(() => {
    const isTouchViewport =
      typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none), (pointer: coarse)').matches || window.innerWidth <= 1024)

    // Keep native scrolling on touch/mobile for natural speed and inertia.
    if (isTouchViewport) {
      lenisRef.current = null
      return false
    }

    const baseOptions = {
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      wheelMultiplier: 1,
      /* Slightly snappier than 0.1 — less “rubber band” vs stacked card transforms */
      lerp: 0.14,
      syncTouch: true,
      syncTouchLerp: 0.1,
    }

    const lenis = useWindowScroll
      ? new Lenis(baseOptions)
      : new Lenis({
          ...baseOptions,
          wrapper: scrollerRef.current,
          content: scrollerRef.current?.querySelector('.scroll-stack-inner'),
          touchInertiaMultiplier: 35,
          touchInertia: 0.6,
        })

    // Drive transforms in the same frame as Lenis — avoids 1-frame lag vs smooth wheel.
    const raf = (time) => {
      lenis.raf(time)
      updateCardTransforms()
      animationFrameRef.current = requestAnimationFrame(raf)
    }

    animationFrameRef.current = requestAnimationFrame(raf)
    lenisRef.current = lenis
    return true
  }, [useWindowScroll, updateCardTransforms])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return undefined

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card'),
    )

    cardsRef.current = cards
    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`
      card.style.willChange = 'transform'
      card.style.transformOrigin = 'top center'
      card.style.backfaceVisibility = 'hidden'
      card.style.transform = 'translate3d(0, 0, 0)'
    })

    const didInitLenis = setupLenis()
    let removeNativeListeners = null

    if (!didInitLenis) {
      const target = useWindowScroll ? window : scroller
      const onNativeScroll = () => handleScroll()
      const onViewportChange = () => handleScroll()
      target.addEventListener('scroll', onNativeScroll, { passive: true })
      window.addEventListener('resize', onViewportChange, { passive: true })
      window.visualViewport?.addEventListener('resize', onViewportChange, { passive: true })
      window.visualViewport?.addEventListener('scroll', onViewportChange, { passive: true })
      removeNativeListeners = () => {
        target.removeEventListener('scroll', onNativeScroll)
        window.removeEventListener('resize', onViewportChange)
        window.visualViewport?.removeEventListener('resize', onViewportChange)
        window.visualViewport?.removeEventListener('scroll', onViewportChange)
      }
    }

    updateCardTransforms()

    return () => {
      if (removeNativeListeners) removeNativeListeners()
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (lenisRef.current) lenisRef.current.destroy()
      stackCompletedRef.current = false
      cardsRef.current = []
      rafPendingRef.current = false
    }
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
  ])

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  )
}

export default ScrollStack
