import {DragHandleIcon, ImagesIcon, TrashIcon, UploadIcon} from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  Flex,
  Grid,
  Spinner,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui'
import createImageUrlBuilder from '@sanity/image-url'
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {nanoid} from 'nanoid'
import {useCallback, useEffect, useMemo, useRef, useState, type DragEvent} from 'react'
import {set, useClient, useDataset, useProjectId, type ArrayOfObjectsInputProps} from 'sanity'

const MAX_GALLERY = 30
const PAGE_SIZE = 48

/** Matches gallery array member: image + optional alt / hotspot from schema */
type GalleryImageValue = {
  _type: 'image'
  _key: string
  asset?: {_ref?: string; _type?: 'reference'}
  alt?: string
  hotspot?: Record<string, unknown>
  crop?: Record<string, unknown>
}

type AssetRow = {_id: string; originalFilename?: string; url?: string}
type AssetUsageRow = {_id: string; refs: number}

/** iOS HEIC + some PNG exports use empty or generic MIME — still allow upload */
function isLikelyImageFile(f: File) {
  if (f.type.startsWith('image/')) return true
  if (f.type === 'application/octet-stream' && /\.(png|jpe?g|gif|webp|heic|heif)$/i.test(f.name)) {
    return true
  }
  return /\.(heic|heif|jpg|jpeg|png|gif|webp)$/i.test(f.name)
}

/** Broad `image/*` keeps multi-select working on Safari/iOS; long MIME lists can limit selection. */
const FILE_ACCEPT = 'image/*'

function galleryAssetListQuery(start: number, end: number) {
  return `*[_type == "sanity.imageAsset"] | order(_createdAt desc) [${start}...${end}]{_id, originalFilename, url}`
}

function SortableThumb({
  id,
  url,
  index,
  alt,
  onAltChange,
  onRemove,
}: {
  id: string
  url: string | null
  index: number
  alt: string
  onAltChange: (next: string) => void
  onRemove: () => void
}) {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      padding={2}
      radius={2}
      shadow={1}
      style={style}
      tone="default"
    >
      <Stack space={2}>
        <Flex align="center" justify="space-between" gap={2}>
          <Button
            icon={DragHandleIcon}
            mode="bleed"
            padding={1}
            title="Drag to reorder"
            {...attributes}
            {...listeners}
          />
          <Button
            icon={TrashIcon}
            mode="bleed"
            padding={1}
            title="Remove"
            tone="critical"
            onClick={onRemove}
          />
        </Flex>
        <Box
          style={{
            aspectRatio: '1',
            borderRadius: 6,
            overflow: 'hidden',
            background: 'var(--card-muted-bg-color)',
          }}
        >
          {url ? (
            <img
              alt=""
              src={url}
              style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
            />
          ) : (
            <Flex align="center" justify="center" style={{height: '100%'}}>
              <Text muted size={1}>
                No preview
              </Text>
            </Flex>
          )}
        </Box>
        <Text muted size={0}>
          Photo {index + 1}
        </Text>
        <TextInput
          fontSize={1}
          placeholder="Alt text (accessibility)"
          value={alt}
          onChange={(e) => onAltChange(e.currentTarget.value)}
        />
      </Stack>
    </Card>
  )
}

/**
 * Real-estate gallery: multi-file upload, dropzone, sortable grid, optional Media library picker.
 */
export function PropertyGalleryInput(props: ArrayOfObjectsInputProps) {
  const client = useClient({apiVersion: '2022-11-15'})
  const projectId = useProjectId()
  const dataset = useDataset()
  const {onChange, value} = props

  const items = useMemo(
    () => (Array.isArray(value) ? (value as GalleryImageValue[]) : []),
    [value],
  )

  const builder = useMemo(() => {
    if (!projectId || !dataset) return null
    return createImageUrlBuilder({projectId, dataset})
  }, [projectId, dataset])

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({done: 0, total: 0})
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [libOpen, setLibOpen] = useState(false)
  const [libPage, setLibPage] = useState(1)
  const [libTotal, setLibTotal] = useState(0)
  const [libRows, setLibRows] = useState<AssetRow[]>([])
  const [libLoading, setLibLoading] = useState(false)
  const [libSelected, setLibSelected] = useState<Set<string>>(() => new Set())
  const [gallerySelected, setGallerySelected] = useState<Set<string>>(() => new Set())
  const [libActionBusy, setLibActionBusy] = useState(false)
  const [libActionMessage, setLibActionMessage] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {activationConstraint: {distance: 6}}),
    useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates}),
  )

  const remainingSlots = Math.max(0, MAX_GALLERY - items.length)
  const totalPages = Math.max(1, Math.ceil(libTotal / PAGE_SIZE))

  const fetchLibCount = useCallback(() => {
    client.fetch<number>('count(*[_type == "sanity.imageAsset"])').then(setLibTotal).catch(() => setLibTotal(0))
  }, [client])

  useEffect(() => {
    fetchLibCount()
  }, [fetchLibCount])

  useEffect(() => {
    setGallerySelected((prev) => {
      if (prev.size === 0) return prev
      const validKeys = new Set(items.map((item) => item._key))
      const next = new Set([...prev].filter((key) => validKeys.has(key)))
      return next.size === prev.size ? prev : next
    })
  }, [items])

  useEffect(() => {
    if (!libOpen) return
    setLibLoading(true)
    const start = (libPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    client
      .fetch<AssetRow[]>(galleryAssetListQuery(start, end))
      .then(setLibRows)
      .finally(() => setLibLoading(false))
  }, [client, libOpen, libPage])

  const thumbUrl = useCallback(
    (item: GalleryImageValue) => {
      if (!builder || !item?.asset?._ref) return null
      try {
        return builder.image(item).width(280).height(280).fit('crop').auto('format').url()
      } catch {
        return null
      }
    },
    [builder],
  )

  const appendImages = useCallback(
    (newRows: GalleryImageValue[]) => {
      if (newRows.length === 0) return
      const cap = Math.min(newRows.length, remainingSlots)
      const slice = newRows.slice(0, cap)
      if (slice.length === 0) return
      const next = [...items, ...slice]
      onChange(set(next))
    },
    [items, onChange, remainingSlots],
  )

  const uploadFiles = useCallback(
    async (fileList: FileList | File[] | null) => {
      if (!fileList || uploading) return
      const files = Array.from(fileList).filter(isLikelyImageFile)
      if (files.length === 0) return

      const cap = Math.min(files.length, remainingSlots)
      if (cap === 0) {
        setUploadError(`Gallery is full (max ${MAX_GALLERY} images).`)
        return
      }

      setUploadError(null)
      setUploading(true)
      setUploadProgress({done: 0, total: cap})

      /** Append after each asset so form state stays in sync across awaits (fixes batch PNG issues). */
      let accumulated = [...items]
      try {
        for (let i = 0; i < cap; i++) {
          const file = files[i]
          const asset = await client.assets.upload('image', file, {
            filename: file.name,
            label: file.name,
          })
          const newItem: GalleryImageValue = {
            _type: 'image',
            _key: nanoid(),
            asset: {_ref: asset._id, _type: 'reference'},
          }
          accumulated = [...accumulated, newItem]
          onChange(set(accumulated))
          setUploadProgress({done: i + 1, total: cap})
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Upload failed'
        setUploadError(
          accumulated.length > items.length
            ? `${msg} (${accumulated.length - items.length} image(s) were added before the error.)`
            : msg,
        )
      } finally {
        setUploading(false)
        setUploadProgress({done: 0, total: 0})
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    },
    [client, items, onChange, remainingSlots, uploading],
  )

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const {active, over} = event
      if (!over || active.id === over.id) return
      const oldIndex = items.findIndex((it) => it._key === active.id)
      const newIndex = items.findIndex((it) => it._key === over.id)
      if (oldIndex < 0 || newIndex < 0) return
      onChange(set(arrayMove(items, oldIndex, newIndex)))
    },
    [items, onChange],
  )

  const removeAt = useCallback(
    (index: number) => {
      const next = items.filter((_, i) => i !== index)
      onChange(set(next))
    },
    [items, onChange],
  )

  const updateAltAt = useCallback(
    (index: number, nextAlt: string) => {
      const next = items.map((it, i) =>
        i === index ? {...it, alt: nextAlt} : it,
      )
      onChange(set(next))
    },
    [items, onChange],
  )

  const removeSelectedGallery = useCallback(() => {
    if (gallerySelected.size === 0) return
    const next = items.filter((item) => !gallerySelected.has(item._key))
    onChange(set(next))
    setGallerySelected(new Set())
  }, [gallerySelected, items, onChange])

  const libInsert = useCallback(() => {
    const ids = [...libSelected]
    if (ids.length === 0) return
    const cap = Math.min(ids.length, remainingSlots)
    const rows: GalleryImageValue[] = ids.slice(0, cap).map((id) => ({
      _type: 'image',
      _key: nanoid(),
      asset: {_ref: id, _type: 'reference'},
    }))
    appendImages(rows)
    setLibSelected(new Set())
    setLibOpen(false)
    setLibPage(1)
  }, [appendImages, libSelected, remainingSlots])

  const libDeleteSelectedSafe = useCallback(async () => {
    const ids = [...libSelected]
    if (ids.length === 0 || libActionBusy) return

    setLibActionBusy(true)
    setLibActionMessage(null)
    try {
      const usageRows = await client.fetch<AssetUsageRow[]>(
        '*[_type == "sanity.imageAsset" && _id in $ids]{_id, "refs": count(*[references(^._id)])}',
        {ids},
      )

      const unusedIds = usageRows.filter((row) => row.refs === 0).map((row) => row._id)
      const skippedCount = ids.length - unusedIds.length

      if (unusedIds.length > 0) {
        const tx = client.transaction()
        for (const id of unusedIds) tx.delete(id)
        await tx.commit()
      }

      setLibSelected(new Set())
      fetchLibCount()
      setLibRows((prev) => prev.filter((row) => !unusedIds.includes(row._id)))
      setLibActionMessage(
        skippedCount > 0
          ? `Deleted ${unusedIds.length} image(s). Skipped ${skippedCount} image(s) because they are still used in listings.`
          : `Deleted ${unusedIds.length} image(s).`,
      )
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not delete selected images'
      setLibActionMessage(message)
    } finally {
      setLibActionBusy(false)
    }
  }, [client, fetchLibCount, libActionBusy, libSelected])

  const libToggle = useCallback((id: string) => {
    setLibSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(false)
      if (e.dataTransfer?.files?.length) void uploadFiles(e.dataTransfer.files)
    },
    [uploadFiles],
  )

  const uploadDisabled = uploading || remainingSlots === 0

  return (
    <Stack space={4}>
      <Card
        padding={4}
        radius={3}
        shadow={1}
        tone={dragOver ? 'primary' : 'transparent'}
        style={{
          border: '2px dashed var(--card-border-color)',
          transition: 'border-color 120ms ease',
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        }}
        onDrop={onDrop}
      >
        <Stack space={4}>
          <Flex align="center" gap={3} justify="space-between" wrap="wrap">
            <Flex align="center" gap={2}>
              <UploadIcon />
              <Text size={2} weight="semibold">
                Upload multiple images
              </Text>
            </Flex>
            <Text muted size={1}>
              {items.length} / {MAX_GALLERY} · {remainingSlots} slots left
            </Text>
          </Flex>
          <Stack space={2}>
            <Text muted size={1}>
              <strong>iPhone / iPad:</strong> tap <strong>Add photos (multiple)</strong> (or the file-picker link). When
              Photos opens, tap <strong>Select</strong>, tap several photos (they get a blue check), then tap{' '}
              <strong>Add</strong>. That uploads many at once. Using <strong>Take Photo</strong> only adds one shot at
              a time — use Select for batches.
            </Text>
            <Text muted size={1}>
              <strong>Desktop:</strong> drag files onto this box, or use <strong>Add photos</strong>.{' '}
              <strong>Media library</strong> adds existing uploads in one step. Reorder with the grip handle.
            </Text>
          </Stack>

          {uploading && (
            <Stack space={2}>
              <Text size={1}>
                Uploading {uploadProgress.done} / {uploadProgress.total}…
              </Text>
              <Box
                style={{
                  height: 6,
                  borderRadius: 999,
                  background: 'var(--card-muted-bg-color)',
                  overflow: 'hidden',
                }}
              >
                <Box
                  style={{
                    height: '100%',
                    width: `${uploadProgress.total ? (100 * uploadProgress.done) / uploadProgress.total : 0}%`,
                    background: 'var(--card-focus-ring-color)',
                    transition: 'width 160ms ease',
                  }}
                />
              </Box>
            </Stack>
          )}

          {uploadError && (
            <Text size={1} style={{color: 'var(--card-badge-critical-fg-color)'}}>
              {uploadError}
            </Text>
          )}

          <Flex gap={2} wrap="wrap">
            {/* Native file input overlays the button so taps open the real multi picker (fixes iOS Safari). */}
            <Box
              style={{
                position: 'relative',
                display: 'inline-block',
                minWidth: 'min(100%, 280px)',
                flex: '1 1 200px',
                minHeight: 44,
              }}
            >
              <Box style={{pointerEvents: 'none'}}>
                <Button
                  disabled={uploadDisabled}
                  icon={UploadIcon}
                  mode="default"
                  text="Add photos (multiple)"
                  tone="primary"
                />
              </Box>
              <input
                ref={fileInputRef}
                aria-label="Add multiple photos from your device"
                disabled={uploadDisabled}
                multiple
                type="file"
                accept={FILE_ACCEPT}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: uploadDisabled ? 'not-allowed' : 'pointer',
                  fontSize: 0,
                  zIndex: 1,
                }}
                onChange={(e) => void uploadFiles(e.target.files)}
              />
            </Box>
            <Button
              disabled={uploadDisabled}
              icon={ImagesIcon}
              mode="ghost"
              text="Add from Media library…"
              onClick={() => {
                setLibOpen(true)
                setLibPage(1)
                setLibActionMessage(null)
                fetchLibCount()
              }}
            />
            <Button
              disabled={uploadDisabled}
              mode="bleed"
              text="Open file picker (multi-select)"
              title="Same as Add photos — use this if the blue button is hard to tap"
              onClick={() => fileInputRef.current?.click()}
            />
          </Flex>
        </Stack>
      </Card>

      {items.length > 0 && (
        <Stack space={3}>
          <Flex align="center" justify="space-between" gap={2} wrap="wrap">
            <Text size={1} weight="semibold">
              Gallery preview
            </Text>
            <Flex gap={2} wrap="wrap">
              <Button
                mode="bleed"
                text="Select all"
                onClick={() => setGallerySelected(new Set(items.map((item) => item._key)))}
              />
              <Button
                disabled={gallerySelected.size === 0}
                mode="bleed"
                text="Clear selection"
                onClick={() => setGallerySelected(new Set())}
              />
              <Button
                disabled={gallerySelected.size === 0}
                mode="default"
                tone="critical"
                text={`Remove selected (${gallerySelected.size})`}
                onClick={removeSelectedGallery}
              />
            </Flex>
          </Flex>
          <DndContext collisionDetection={closestCenter} sensors={sensors} onDragEnd={onDragEnd}>
            <SortableContext items={items.map((i) => i._key)} strategy={rectSortingStrategy}>
              <Grid columns={[2, 3, 3, 4]} gap={3}>
                {items.map((item, index) => (
                  <Stack key={item._key} space={2}>
                    <Flex align="center" gap={2}>
                      <Checkbox
                        checked={gallerySelected.has(item._key)}
                        id={`gallery-select-${item._key}`}
                        onChange={() => {
                          setGallerySelected((prev) => {
                            const next = new Set(prev)
                            if (next.has(item._key)) next.delete(item._key)
                            else next.add(item._key)
                            return next
                          })
                        }}
                      />
                      <label htmlFor={`gallery-select-${item._key}`}>
                        <Text size={1}>Select</Text>
                      </label>
                    </Flex>
                    <SortableThumb
                      id={item._key}
                      index={index}
                      alt={typeof item.alt === 'string' ? item.alt : ''}
                      url={thumbUrl(item)}
                      onAltChange={(next) => updateAltAt(index, next)}
                      onRemove={() => removeAt(index)}
                    />
                  </Stack>
                ))}
              </Grid>
            </SortableContext>
          </DndContext>
        </Stack>
      )}

      {libOpen && (
        <Dialog
          header="Add from Media library"
          id="property-gallery-media-lib"
          onClose={() => {
            setLibOpen(false)
            setLibSelected(new Set())
            setLibPage(1)
            setLibActionMessage(null)
          }}
          width={100}
        >
          <Stack padding={4} space={4}>
            <Flex align="center" gap={3} justify="space-between" wrap="wrap">
              <Text muted size={1}>
                Page {libPage} of {totalPages} · {libTotal} assets
              </Text>
              <Flex gap={2} wrap="wrap">
                <Button
                  disabled={libActionBusy || libSelected.size === 0}
                  mode="ghost"
                  text={`Delete selected (${libSelected.size})`}
                  tone="critical"
                  onClick={() => void libDeleteSelectedSafe()}
                />
                <Button
                  disabled={libPage <= 1}
                  mode="ghost"
                  text="Previous"
                  onClick={() => setLibPage((p) => Math.max(1, p - 1))}
                />
                <Button
                  disabled={libPage >= totalPages}
                  mode="ghost"
                  text="Next"
                  onClick={() => setLibPage((p) => Math.min(totalPages, p + 1))}
                />
              </Flex>
            </Flex>

            {libLoading ? (
              <Flex align="center" justify="center" paddingY={5}>
                <Spinner />
              </Flex>
            ) : (
              <Grid columns={[2, 3, 4]} gap={3}>
                {libRows.map((row) => {
                  const checked = libSelected.has(row._id)
                  const label = row.originalFilename || row._id
                  return (
                    <Card key={row._id} padding={3} radius={2} tone={checked ? 'primary' : 'default'}>
                      <Stack space={3}>
                        <Flex align="center" gap={3}>
                          <Checkbox
                            checked={checked}
                            id={`pg-${row._id}`}
                            onChange={() => libToggle(row._id)}
                          />
                          <label htmlFor={`pg-${row._id}`}>
                            <Text size={1} weight="medium">
                              {label}
                            </Text>
                          </label>
                        </Flex>
                        {row.url ? (
                          <Box>
                            <img
                              alt=""
                              src={`${row.url}?w=240`}
                              style={{
                                width: '100%',
                                height: 120,
                                objectFit: 'contain',
                                display: 'block',
                                background: 'var(--card-muted-bg-color)',
                                borderRadius: 4,
                              }}
                            />
                          </Box>
                        ) : (
                          <Text muted size={1}>
                            No preview
                          </Text>
                        )}
                      </Stack>
                    </Card>
                  )
                })}
              </Grid>
            )}

            {libActionMessage && (
              <Text size={1} muted>
                {libActionMessage}
              </Text>
            )}

            <Flex gap={2} justify="flex-end" wrap="wrap">
              <Button
                mode="ghost"
                text="Cancel"
                onClick={() => {
                  setLibOpen(false)
                  setLibSelected(new Set())
                  setLibPage(1)
                  setLibActionMessage(null)
                }}
              />
              <Button
                disabled={libSelected.size === 0}
                text={
                  libSelected.size === 0
                    ? 'Add selected images'
                    : `Add selected images (${libSelected.size})`
                }
                tone="primary"
                onClick={libInsert}
              />
            </Flex>
          </Stack>
        </Dialog>
      )}
    </Stack>
  )
}
