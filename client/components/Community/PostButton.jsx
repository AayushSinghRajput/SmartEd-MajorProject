import { FiPlus } from "react-icons/fi";

/**
 * Button to open the post popup
 */
export default function PostButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-0 right-0  mr-4 flex items-center gap-2
                 bg-indigo-600 text-white px-4 py-2 rounded-full
                 hover:bg-indigo-700 transition z-50"
    >
      <FiPlus />
      New Post
    </button>
  );
}
