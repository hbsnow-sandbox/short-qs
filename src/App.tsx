import { MouseEventHandler, useState } from "react";
import LZString from "lz-string";
import { useForm } from "react-hook-form";

type Values = {
  message: string;
};

function App() {
  const [{ message, compressed }, setResult] = useState({
    message: "",
    compressed: "",
  });

  const { register, handleSubmit, watch, reset } = useForm<Values>({
    defaultValues: {
      message: "",
    },
  });

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    const params = new URLSearchParams(window.location.search);
    const compressed = params.get("q") ?? "";
    const message = LZString.decompressFromEncodedURIComponent(compressed);
    setResult({ message, compressed });
    reset();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        文字列短縮してクエリ文字列に反映する
      </h1>

      <form
        // MEMO: https://github.com/orgs/react-hook-form/discussions/8020
        onSubmit={(...args) =>
          void handleSubmit((data) => {
            const compressed = LZString.compressToEncodedURIComponent(
              data.message
            );
            setResult({ message: data.message, compressed });
            history.replaceState({}, "", `${location.pathname}?q=${qs}`);
          })(...args)
        }
        className="mt-4"
      >
        <label className="block">
          <p>文字を入力してください</p>
          <textarea
            className="rounded border w-full"
            {...register("message")}
          />
        </label>

        <div className="flex gap-4 mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 px-4 rounded"
          >
            保存
          </button>
          <button
            type="button"
            className="border-blue-600 border text-blue-600 p-2 px-4 rounded"
            onClick={handleClick}
          >
            現在のクエリ文字列を反映
          </button>
        </div>
      </form>

      <section className="mt-4">
        <h2 className="text-2xl font-bold">結果</h2>
        <div className="mt-2">
          <ul>
            <li className="text-sm text-gray-600">
              入力文字数: {message.length}
            </li>
            <li className="text-sm text-gray-600">
              変換文字数: {compressed.length}
            </li>
          </ul>
          <div className="border overflow-auto p-2">
            <div className="text-sm text-gray-600 font-bold">入力文字</div>
            {message || "出力結果がありません"}
          </div>
          <div className="border overflow-auto p-2 mt-4">
            <div className="text-sm text-blue-600 font-bold">変換文字</div>
            {compressed || "出力結果がありません"}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
