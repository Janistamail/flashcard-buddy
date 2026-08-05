"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSaveVocab } from "@/app/hooks/useSaveVocab";

export type SaveVocabModalValues = {
  word: string;
  englishMeaning: string;
  thai: string;
  example1: string;
  example2: string;
};

interface SaveVocabModalProps {
  initialValues: SaveVocabModalValues;
  onClose: () => void;
}

const inputClassName =
  "rounded-lg border border-input bg-background px-4 py-2 text-foreground outline-none focus:border-ring disabled:opacity-50";

function Field({
  label,
  ...props
}: React.ComponentProps<"input"> & { label: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-muted-foreground">
      {label}
      <input {...props} className={inputClassName} />
    </label>
  );
}

const fields: {
  key: keyof SaveVocabModalValues;
  label: string;
  required?: boolean;
}[] = [
  { key: "word", label: "Word", required: true },
  { key: "englishMeaning", label: "English meaning", required: true },
  { key: "thai", label: "Thai meaning", required: true },
  { key: "example1", label: "Example 1", required: true },
  { key: "example2", label: "Example 2", required: true },
];

export default function SaveVocabModal({
  initialValues,
  onClose,
}: SaveVocabModalProps) {
  const [values, setValues] = useState(initialValues);
  const {
    status,
    error: saveError,
    duplicate,
    save,
    dismissDuplicate,
  } = useSaveVocab();
  const saving = status === "saving";

  useEffect(() => {
    if (status === "saved") {
      toast.success("Saved!");
      onClose();
    }
  }, [status, onClose]);

  useEffect(() => {
    if (saveError) toast.error(saveError);
  }, [saveError]);

  useEffect(() => {
    if (duplicate) {
      toast.error("This vocab already exists");
      dismissDuplicate();
    }
  }, [duplicate, dismissDuplicate]);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;

    const examples = [values.example1, values.example2].filter(
      (example) => example.trim().length > 0
    );
    await save({
      english: values.word,
      thai: values.thai,
      englishMeaning: values.englishMeaning,
      examples,
    });
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Vocab</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {fields.map(({ key, label, required }) => (
            <Field
              key={key}
              label={label}
              value={values[key]}
              onChange={(e) => {
                const value = e.currentTarget.value;
                setValues((prev) => ({ ...prev, [key]: value }));
              }}
              disabled={saving}
              required={required}
            />
          ))}

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner />}
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
