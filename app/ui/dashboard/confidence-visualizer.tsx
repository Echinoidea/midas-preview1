import clsx from 'clsx';

function Square({ color }: { color: string }) {
  return (
    <div
      className={clsx('mx-1 h-2 w-2 xl:h-3 xl:w-3', {
        'bg-zinc-400': color === 'gray' || color === 'grey',
        'bg-red-500': color === 'red',
        'bg-amber-300': color === 'yellow',
        'bg-green-400': color === 'green',
      })}
    ></div>
  );
}

function mapSquares(confidence: string): [string, string, string] {
  console.log(confidence)
  if (confidence.toLowerCase() === "low") {
    return ['red', 'grey', 'grey'];
  }
  else if (confidence.toLowerCase() === "some") {
    return ['yellow', 'yellow', 'grey'];
  }
  else {
    return ['green', 'green', 'green'];
  }
}

export function ConfidenceIntervalVisualizer({
  confidence,
  className
}: {
  confidence: string | undefined;
  className?: string;
}) {
  return (
    <div className={`mx-2 flex flex-row ${className}`}>
      {
        mapSquares(confidence!).map((color, index) => (
          <Square key={index} color={color} />
        ))
      }
    </div>
  );
}
