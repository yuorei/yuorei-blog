import React from "react";

const Footer: React.FC = () => {
  let year = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 py-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-white">© {year} yuorei blog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
