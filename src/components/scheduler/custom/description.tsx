import { ReactElement, useState } from 'react';

const wildcardExplanation: { [key: string]: string } = {
  ',': `The , (comma) wildcard includes additional values. In the Month field, JAN,FEB,MAR includes January, February, and March.`,
  '-': `The - (dash) wildcard specifies ranges. In the Day field, 1-15 includes days 1 through 15 of the specified month.`,
  '*': `The * (asterisk) wildcard includes all values in the field. In the Hours field, * includes every hour. You can't use * in both the Day-of-month and Day-of-week fields. If you use it in one, you must use ? in the other.`,
  '/': `The / (slash) wildcard specifies increments. In the Minutes field, you could enter 1/10 to specify every tenth minute, starting from the first minute of the hour (for example, the 11th, 21st, and 31st minute, and so on).`,
  '?': `The ? (question mark) wildcard specifies any. In the Day-of-month field you could enter 7 and if any day of the week was acceptable, you could enter ? in the Day-of-week field.`,
  L: `The L wildcard in the Day-of-month or Day-of-week fields specifies the last day of the month or week.`,
  W: `The W wildcard in the Day-of-month field specifies a weekday. In the Day-of-month field, 3W specifies the weekday closest to the third day of the month.`,
  '#': `The # wildcard in the Day-of-week field specifies a certain instance of the specified day of the week within a month. For example, 3#2 would be the second Tuesday of the month: the 3 refers to Tuesday because it is the third day of each week, and the 2 refers to the second day of that type within the month.\nNote: If you use a '#' character, you can define only one expression in the day-of-week field. For example, "3#1,6#3" is not valid because it is interpreted as two expressions.`,
};

export default ({
  allowedValueRange,
  wildcards,
}: {
  allowedValueRange: string;
  wildcards: string[];
}): ReactElement => {
  const [explanation, setExplanation] = useState('');

  const handleWildcardHover = (e: unknown, wildcard: string) =>
    setExplanation(wildcardExplanation[wildcard]);

  const handleOnMouseLeave = () => setExplanation('');

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-3 text-center">Allowed Values</div>
      <div className="col-span-3 text-center font-bold">
        {allowedValueRange}
      </div>
      <hr className="col-span-3"></hr>
      <div className="col-span-3 text-center ">Allowed Wildcards</div>
      {wildcards.map((el, index) => (
        <div
          className="rounded-xl text-center font-bold ring-2 ring-gray-400 hover:ring-cito"
          onMouseOver={(e) => handleWildcardHover(e, el)}
          onMouseLeave={handleOnMouseLeave}
          id={`wildcard-${index}`}
        >
          {el}
        </div>
      ))}
      <hr className="col-span-3"></hr>
      <div className="col-span-3 text-center ">Explanation</div>
      <div
        className={`col-span-3 h-28 break-normal rounded p-4 text-center italic ring-2 ring-cito`}
      >
        {explanation}
      </div>
    </div>
  );
};
