'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/i18n/LanguageProvider';

type FormFieldOption = {
  label: string;
  value: string;
};

type FormField = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
};

type FormValues = Record<string, any>;

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;

  // Modo automático con fields
  fields?: FormField[];
  defaultValues?: FormValues | null;

  // Modo manual con children
  children?: React.ReactNode;

  onSubmit: (data: FormValues | React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  fields,
  defaultValues,
  onSubmit,
  onCancel,
  loading = false,
  children,
  submitLabel,
  cancelLabel,
}: FormModalProps) {
  const { t } = useI18n();
  const [formValues, setFormValues] = useState<FormValues>({});

  useEffect(() => {
    if (!open) return;

    if (fields) {
      const initialValues: FormValues = {};

      fields.forEach((field) => {
        if (field.type === 'checkbox') {
          initialValues[field.name] = Boolean(defaultValues?.[field.name]);
        } else {
          initialValues[field.name] = defaultValues?.[field.name] ?? '';
        }
      });

      setFormValues(initialValues);
    }
  }, [open, fields, defaultValues]);

  const handleChange = (field: FormField, value: string | boolean) => {
    setFormValues((prev) => ({
      ...prev,
      [field.name]: field.type === 'number' && value !== ''
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (fields) {
      await onSubmit(formValues);
      return;
    }

    await onSubmit(e);
  };

  const renderField = (field: FormField) => {
    const value = formValues[field.name];

    if (field.type === 'textarea') {
      return (
        <textarea
          id={field.name}
          value={String(value ?? '')}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
        />
      );
    }

    if (field.type === 'select') {
      return (
        <select
          id={field.name}
          value={String(value ?? '')}
          onChange={(e) => handleChange(field, e.target.value)}
          required={field.required}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione una opción</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === 'checkbox') {
      return (
        <input
          id={field.name}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => handleChange(field, e.target.checked)}
          disabled={loading}
          className="h-4 w-4 rounded border-gray-300"
        />
      );
    }

    return (
      <input
        id={field.name}
        type={field.type ?? 'text'}
        value={String(value ?? '')}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields ? (
            fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && <span className="text-red-600 ml-1">*</span>}
                </label>

                {renderField(field)}
              </div>
            ))
          ) : (
            children
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onCancel?.();
                onOpenChange(false);
              }}
              disabled={loading}
            >
              {cancelLabel ?? t('common.cancel')}
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? t('common.saving') : submitLabel ?? t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}