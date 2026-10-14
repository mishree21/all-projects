function StatCard({
  icon,
  title,
  value,
  change,
  changeColor,
  iconBg,
}) {
  return (
    <div className="bg-white rounded-3xl p-7 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer">

      {/* Top Section */}
      <div className="flex justify-between items-center">

        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>

        {/* Percentage */}
        <span className={`text-base font-semibold ${changeColor}`}>
          {change}
        </span>

      </div>

      {/* Title */}
      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mt-7">
        {title}
      </p>

      {/* Value */}
      <h2 className="text-[42px] font-bold text-gray-900 mt-2">
        {value}
      </h2>

    </div>
  );
}

export default StatCard;
