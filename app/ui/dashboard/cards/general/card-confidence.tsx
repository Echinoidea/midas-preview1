import {
  Tooltip,
  Button,
  useDisclosure,
  Divider,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableBodyProps,
} from '@nextui-org/react';
import { ConfidenceIntervalVisualizer } from '../../confidence-visualizer';
import { Nunito } from 'next/font/google';
import { JSXElementConstructor, ReactElement } from 'react';
import { VariableWeightCell } from '@/app/types/variable-weight-cell';
const nunito = Nunito({
  weight: ['200', '200'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

function TooltipContent() {
  return (
    <div className="max-w-80 flex-wrap">
      The amount of missing variables affect the confidence of the MIDAS risk
      score calculation
      <br />
      <br />
      Click on this card to see a breakdown of the importance of each variable
    </div>
  );
}

function VariableWeightsTable({
  variables,
}: {
  variables: VariableWeightCell[];
}) {
  function mapTableBody(): ReactElement<
    TableBodyProps<object>,
    string | JSXElementConstructor<any>
  > {
    const missingTrue = (
      <TableCell className="text-xl text-red-400">Missing!</TableCell>
    );
    const missingFalse = <TableCell className="text-xl">{undefined}</TableCell>;

    return (
      <TableBody>
        {variables.map((variable: VariableWeightCell, index: number) => (
          <TableRow key={index}>
            <TableCell className="text-xl">{variable.name}</TableCell>
            {variable.missing ? missingTrue : missingFalse}
            <TableCell className="text-xl">{variable.weight}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableColumn className="text-2xl">Variable</TableColumn>
        <TableColumn className="text-2xl">Missing?</TableColumn>
        <TableColumn className="text-2xl">Weight</TableColumn>
      </TableHeader>
      {mapTableBody()}
    </Table>
  );
}

const variables = [
  {
    name: 'Gender',
    weight: 'Medium',
    missing: false,
  },
  {
    name: 'Ethnicity',
    weight: 'Low',
    missing: false,
  },
  {
    name: 'English Learner',
    weight: 'Low',
    missing: false,
  },
  {
    name: 'Office Disciplinary Referrals',
    weight: 'Low',
    missing: false,
  },
  {
    name: 'Suspensions',
    weight: 'Low',
    missing: false,
  },
  {
    name: 'Math Test Risk',
    weight: 'Low',
    missing: false,
  },
  {
    name: 'Reading Test Risk',
    weight: 'Low',
    missing: false,
  },
  {
    name: 'Saebrs/MySaebrs Total',
    weight: 'Low',
    missing: false,
  },
  {
    name: 'Saebrs/MySaebrs Social',
    weight: 'Low',
    missing: false,
  },
  {
    name: 'Saebrs/MySaebrs Emotional',
    weight: 'Low',
    missing: false,
  },
  {
    name: 'Saebrs/MySaebrs Academic',
    weight: 'Low',
    missing: false,
  },
];

/**
 * Card with confidence label and confidence visualizer.
 * Visualizer is calculated by where the confidence prop value is in regards to the 
 * list of confidenceThresholds. There should be 
 */
export function CardConfidenceVisualizer({
  confidence,
  missingVariables,
  className
}: {
  confidence: string;
  missingVariables: number;
  className?: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Tooltip content={TooltipContent()} placement="bottom" className={`max-w-[32rem] ${nunito.className}`} >
      <div onClick={onOpen} className={`${className}`}>
        <Card
          className={`${nunito.className}  bg-neutral-50 h-full`}
          shadow="md"
        >

          <CardBody className="flex flex-col   w-full h-full px-4 justify-between">
            <h3 className="text-lg font-medium text-nowrap text-slate-800">
              MIDAS Risk Confidence
            </h3>

            <div className="flex flex-col justify-between items-center h-full overflow-hidden ">
              <p className="text-md xl:text-3xl"> {confidence} </p>

              <ConfidenceIntervalVisualizer
                confidence={confidence || "low"}
              />

              <p className="mr-0 ml-auto mb-2 mt-auto text-xs italic">
                Click to see more information
              </p>
            </div>
            {/**

            <p className="absolute bottom-3 right-2 ml-auto mr-0 pb-1 pr-0 text-sm text-nowrap italic ">
              Click to see more information
            </p>
            **/}
          </CardBody>
        </Card>

        <Modal
          className={nunito.className}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="3xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Confidence Score Explaination
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-wrap">
                    The confidence of the MIDAS risk score prediction is
                    negatively impacted by having missing values in the data.
                    <br />
                    <br />
                    Each variable may also be weighted differently. For example,
                    if a sample of students is missing their MySaebrs scores,
                    then the confidence will be more significantly affected than
                    if their English Language Learner status is missing.
                    <br />
                    <br />
                    Below is a breakdown of the weights of each variable.
                    <span className="text-xl font-semibold">
                      Missing values: {missingVariables}
                    </span>
                  </div>

                  <Divider />

                  <VariableWeightsTable variables={variables} />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </Tooltip>
  );
}
