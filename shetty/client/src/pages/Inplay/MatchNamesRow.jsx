import React from "react";

function MatchNamesRow({ items = [] }) {
  return (
    <div className="p-2 flex gap-2 overflow-x-scroll scrollbar-hide match-names-row animate-blink">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl activetab-bg p-2 min-w-fit text-[#000000] text-sm font-[400] cursor-pointer"
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

export default MatchNamesRow;