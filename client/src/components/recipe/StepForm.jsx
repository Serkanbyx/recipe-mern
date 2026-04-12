import { useMemo, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus } from 'lucide-react';

const SortableStepRow = ({ step, index, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAutoResize = useCallback((e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${
        isDragging ? 'shadow-lg opacity-80 z-10' : ''
      }`}
    >
      {/* Drag Handle */}
      <button
        type="button"
        className="mt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 touch-none"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Step Number Badge */}
      <div className="mt-2 shrink-0 w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
        {index + 1}
      </div>

      {/* Textarea */}
      <textarea
        placeholder="Describe this step..."
        value={step.text}
        onChange={(e) => onUpdate(index, e.target.value)}
        onInput={handleAutoResize}
        rows={2}
        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors resize-none"
      />

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(index)}
        className="mt-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
        aria-label={`Remove step ${index + 1}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

const StepForm = ({ steps, onChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const itemIds = useMemo(() => steps.map((step) => step.id), [steps]);

  const handleAdd = () => {
    onChange([...steps, { id: crypto.randomUUID(), text: '' }]);
  };

  const handleDelete = (index) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  const handleUpdate = (index, value) => {
    const updated = steps.map((step, i) =>
      i === index ? { ...step, text: value } : step
    );
    onChange(updated);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = steps.findIndex((step) => step.id === active.id);
    const newIndex = steps.findIndex((step) => step.id === over.id);
    onChange(arrayMove(steps, oldIndex, newIndex));
  };

  const showError = steps.length === 0;

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={itemIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {steps.map((step, index) => (
              <SortableStepRow
                key={step.id}
                step={step}
                index={index}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showError && (
        <p className="text-sm text-red-500" role="alert">
          At least 1 step is required.
        </p>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Step
      </button>
    </div>
  );
};

export default StepForm;
