import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div className="flex mx-auto bg-black shadow-lg rounded-lg overflow-hidden">
        <div className="w-full h-1/3 sm:w-auto sm:h-auto">
          <img
            className="w-full h-full object-cover pointer-events-none"
            src="/notfound.png"
            alt="Error"
          />
        </div>
        <div className="w-auto bg-black text-white py-8 px-6 sm:flex sm:flex-col sm:justify-center sm:items-center">
          <h2 className="text-2xl sm:text-9xl font-semibold mb-2">404</h2>
          <p className="text-sm sm:text-3xl mb-4">
            ページが見つかりませんでした。
          </p>
          <p className="text-xs sm:text-3xl mb-4">
            お探しのページは、移動または削除された可能性があります。
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
