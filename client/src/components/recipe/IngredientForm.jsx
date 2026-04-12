import { useMemo } from 'react';
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
import { UNITS } from '../../utils/constants';

const SortableIngredientRow = ({ ingredient, index, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ingredient.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${
        isDragging ? 'shadow-lg opacity-80 z-10' : ''
      }`}
    >
      {/* Drag Handle */}
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 touch-none"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Amount */}
      <input
        type="text"
        placeholder="2"
        value={ingredient.amount}
        onChange={(e) => onUpdate(index, 'amount', e.target.value)}
        className="w-[20%] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
      />

      {/* Unit */}
      <select
        value={ingredient.unit}
        onChange={(e) => onUpdate(index, 'unit', e.target.value)}
        className="w-[25%] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
      >
        {UNITS.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>

      {/* Name */}
      <input
        type="text"
        placeholder="flour"
        value={ingredient.name}
        onChange={(e) => onUpdate(index, 'name', e.target.value)}
        className="w-[45%] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
      />

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(index)}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        aria-label={`Remove ingredient ${ingredient.name || index + 1}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

const IngredientForm = ({ ingredients, onChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const itemIds = useMemo(
    () => ingredients.map((ing) => ing.id),
    [ingredients]
  );

  const handleAdd = () => {
    onChange([
      ...ingredients,
      { id: crypto.randomUUID(), amount: '', unit: 'g', name: '' },
    ]);
  };

  const handleDelete = (index) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const handleUpdate = (index, field, value) => {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    onChange(updated);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ingredients.findIndex((ing) => ing.id === active.id);
    const newIndex = ingredients.findIndex((ing) => ing.id === over.id);
    onChange(arrayMove(ingredients, oldIndex, newIndex));
  };

  const showError = ingredients.length === 0;

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
            {ingredients.map((ingredient, index) => (
              <SortableIngredientRow
                key={ingredient.id}
                ingredient={ingredient}
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
          At least 1 ingredient is required.
        </p>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Ingredient
      </button>
    </div>
  );
};

export default IngredientForm;
