
interface DeletePopupProps {
  id: string;
  onConfirm: (id: string) => void | Promise<void>;
  onCancel: () => void;
}

export default function DeletePopup({ id, onConfirm, onCancel }: DeletePopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
        <h2 className="text-lg font-semibold text-gray-800">Delete Confirmation</h2>
        <p className="text-sm text-gray-600 mt-2">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(id)} // ✅ now id exists
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
