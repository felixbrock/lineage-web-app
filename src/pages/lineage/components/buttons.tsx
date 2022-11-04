import { MouseEventHandler } from 'react';

type ButtonSmallProps = {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  customCSS?: React.CSSProperties;
};

export function ButtonSmall({
  buttonText,
  onClick,
  className,
  customCSS,
}: ButtonSmallProps): JSX.Element {
  return (
    <>
      <button
        onClick={onClick}
        style={customCSS}
        type="button"
        className={
          'inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cito focus:ring-offset-2 ' +
          className
        }
      >
        {buttonText}
      </button>
    </>
  );
}

export function ButtonBig({
  buttonText,
  onClick,
  className,
  customCSS,
}: ButtonSmallProps): JSX.Element {
  return (
    <>
      <button
        onClick={onClick}
        style={customCSS}
        type="button"
        className={
          'inline-flex items-center rounded border border-gray-300 bg-white px-7 py-5 text-lg font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cito focus:ring-offset-2 ' +
          className
        }
      >
        {buttonText}
      </button>
    </>
  );
}
