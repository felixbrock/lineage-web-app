export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="my-2 mx-4 border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
      <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
    </div>
  );
}
