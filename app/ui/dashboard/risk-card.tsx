/**
 * @since 2024-08-27
 * @author Gabriel
 */

import clsx from 'clsx';
import React, { Fragment, ReactElement } from 'react';
import { Card, CardHeader, Tooltip, Divider } from '@nextui-org/react';
import { Nunito } from 'next/font/google';
import { Capitalize } from '@/action/capitalize';
const nunito = Nunito({
  weight: ['200', '200'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

/**
 * Only for use in this file
 */
type Assessment = {
  name: string;
  values: number[] | string[];
  labels: string[];
  tooltipContent: string | ReactElement;
}

/**
 * Small component to display a single value and label pair in a column structure.
 * @param  value The numeric or string value to display
 * @param  label The label to display below the value
 */
function Metric({
  value,
  label
}: {
  value: number | string;
  label: string;
}): React.ReactElement {
  const isNa = value.toString().toLowerCase() === 'na';

  let border_color = "border-b-grey-400";
  if (label) {

    border_color =
      label.toLowerCase() === "low" || label.toLowerCase() === "zero" ?
        "border-b-green-400" :
        label.toLowerCase() === "some" || label.toLowerCase() === "one +" ?
          "border-b-amber-300" :
          "border-b-red-500";
  }

  return (
    <div className={`flex flex-col items-center text-md lg:text-lg xl:text-2xl`}>
      <p className={clsx(`border-b ${border_color}`, { 'text-slate-600': isNa })}>
        {typeof value == 'number' ? value.toFixed(1) + "%" : Capitalize(value)}
      </p>
      <p className="max-lg:text-sm lg:text-lg font-extralight italic">{label}</p>
    </div>
  );
}

/**
 * Component to display 'n' Metric atoms in a row, with a title.
 * @param  title The title to display above the row
 * @param  values The values to display, from left to right
 * @param  labels The labels to display below the values, from left to right
 */
function Row({
  title,
  values,
  labels
}: {
  title: string;
  values: number[] | string[];
  labels: string[]
}): React.ReactElement {
  return (
    <div className="flex h-20 flex-col w-full">
      <p className="text-sm xl:text-base text-nowrap">{title}</p>
      <div className="flex justify-evenly gap-1 lg:gap-2 xl:gap-8 px-18">
        {values.map((value, index) => (
          <div key={index}>
            <Metric value={value} label={labels[index]} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Display one or more rows containing a title and one or more metrics, which contain a value and a label.
 * @param  title The title of the card.
 * @param  assessments The contents of a row. Contains name, values, labels, and tooltipText.
 */
export function RiskCard({
  title,
  assessments,
  className
}: {
  title: string;
  assessments: Assessment[];
  className?: string;
}): React.ReactElement {
  return (
    <Card className={`${nunito.className} max-md:flex max-md:h-full rounded-xl bg-neutral-50 pb-2  ${className}`}>
      <CardHeader className="">
        <h3 className="text-xl font-medium text-slate-800 text-nowrap">{title}</h3>
      </CardHeader>

      <div className="flex flex-col justify-evenly w-full h-full px-8 -mt-5  ">
        {assessments.map((assessment: Assessment, index: number) => {
          return (
            <Fragment key={index}>
              <Tooltip content={assessment.tooltipContent} placement="bottom" className={`max-w-[32rem] ${nunito.className}`}>
                <div className='flex'>
                  <Row
                    title={assessment.name}
                    values={assessment.values}
                    labels={assessment.labels}
                  />
                </div>
              </Tooltip>
              {index < assessments.length - 1 && (
                <Divider className="mb-1 mt-0" />
              )}
            </Fragment>
          )
        })}
      </div>
    </Card>
  );
}
