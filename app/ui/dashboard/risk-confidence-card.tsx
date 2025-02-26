
/**
 * @since 2024-08-27
 * @author Gabriel
 */

import clsx from 'clsx';
import React, { Fragment, ReactElement } from 'react';
import { Card, CardHeader, Tooltip, Divider } from '@nextui-org/react';
import { Nunito } from 'next/font/google';
import { ConfidenceIntervalVisualizer } from './confidence-visualizer';
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
  return (
    <div className="flex flex-col items-center">
      <p className={clsx('text-2xl', { 'text-slate-600': isNa })}>
        {typeof value == 'number' ? value.toFixed(1) + "%" : Capitalize(value)}
      </p>
      <p className="text-sm font-extralight italic">{label}</p>
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
      <p className="text-md">{title}</p>
      <div className="flex justify-evenly gap-8 lg:gap-2 xl:gap-8 px-18">
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
export function RiskCardWithConfidence({
  title,
  assessments,
  confidence,
  className
}: {
  title: string;
  assessments: Assessment[];
  confidence: string;
  className?: string;
}): React.ReactElement {
  return (
    <Card className={`${nunito.className} items-center justify-center rounded-xl bg-neutral-50 pb-2 ${className}`}>
      <CardHeader className="">
        <h3 className="text-lg font-medium text-slate-800">{title}</h3>
      </CardHeader>

      <div className="flex flex-col justify-between w-full px-8">
        {assessments.map((assessment: Assessment, index: number) => {
          return (
            <Fragment key={index}>
              <Tooltip content={assessment.tooltipContent} placement="bottom" className='max-w-[32rem]'>
                <div className='flex flex-col items-center'>
                  <Row
                    title={assessment.name}
                    values={assessment.values}
                    labels={assessment.labels}
                  />
                  <div className="flex flex-row -mt-6 items-center">

                    <p className="text-sm italic">Confidence: </p>
                    <ConfidenceIntervalVisualizer confidence={confidence} />
                  </div>
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
