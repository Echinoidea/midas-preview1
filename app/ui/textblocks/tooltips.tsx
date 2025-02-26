/**
 * Tooltip / tooltip modal content for dashboard cards.
 * @since 2024-07-02
 */

// import chartImage from '@/public/temporary weights chart.png';
import { Divider } from '@nextui-org/react';
import Image from 'next/image';

export function MidasRiskScoreTooltip() {
  return ( 
  <div className='flex flex-col gap-4'>
    <p>Percentage of students at Low, Some, or High risk based on the MIDAS Risk Indication. 
    This risk score is compiled from various data variables, including gender, grade/school level, 
    ethnicity, English Language Learner Status, Office Disciplinary Referrals, Suspensions, 
    Math Test Scores, Reading test scores, and SAEBRS ratings (i.e., teacher and student). 
    Each variable has a specific weight that contributes to the MIDAS Risk Indication. 
    Below are the weights of each variable.</p>

    <Divider orientation='horizontal'/>
    {/* <Image src={chartImage} alt='chart image'/>  */}

    <p className="italic">The MIDAS Risk Score should not be used as a diagnostic tool nor 
      should be used as the sole determinant of overall social, emotional and behavioral risk</p>
  </div>
  );
}

export function MidasRiskConfidenceTooltip() {
  return (
    <>
      <p>
      The MIDAS Risk Confidence indicates the percentage confidence in the accuracy
       of the MIDAS Risk Indication. The confidence variable can change based 
       on the variables inputted. Press this box for more details about data 
       variables used to compile the MIDAS risk score.
      </p>

      <p>Insert screenshot of missing variables and weights</p>
    </>
  )
}

export function OdrTooltip() {
  return (
    <>
      <p>
      Percentage of students with no office discipline referrals and percentage of students with one or more office discipline referrals.
      </p>
    </>
  )
}

export function SuspensionsTooltip() {
  return (
    <>
      <p>
      Percentage of students with no suspensions and percentage of students with one or more suspensions.
      </p>
    </>
  )
}

export function MathRiskTooltip() {
  return (
    <>
      <p>
      Percentage of students at low risk and percentage of students at some risk based on the selected 
      math assessment. MIDAS was initially calibrated with the aMath assessment from Renaissance Education.
       If a school team uses another standardized math assessment, the validity of predictions may be reduced.
      </p>
    </>
  )
}

export function ReadRiskTooltip() {
  return (
    <>
      <p>
      Percentage of students at low risk and percentage of students at some risk based on the 
      selected reading assessment. MIDAS was initially calibrated with the aReading assessment from 
      Renaissance Education. If a school team uses another standardized assessment, the validity of predictions may be reduced.
      </p>
    </>
  )
}

export function SaebrsTotalTooltip() {
  return (
    <>
      <p>
      Percentage of students at low, some, or high risk for the Total Behavior Score 
      on the SAEBRS-TRS (i.e., Teacher rating). The Total Behavior Score assesses student 
      functioning in terms of general behavior.
      </p>
    </>
  )
}

export function MySaebrsTotalTooltip() {
  return (
    <>
      <p>
      Percentage of students at low, some, or high risk for the Total Behavior score on the mySAEBRS (i.e., Student self-report).
       The Total Behavior Score assess student functioning in terms of general behavior.
      </p>
    </>
  )
}

export function SaebrsEmotionalTooltip() {
  return (
    <>
      <p>
      Percentage of students at low, some, or high risk for the Emotional domain on the SAERBS-TRS 
      (i.e., Teacher rating). The Emotional Domain assesses student ability to regulate internal states, 
      adapt to change, and respond to stressful/challenging events.
      </p>
    </>
  )
}

export function MySaebrsEmotionalTooltip() {
  return (
    <>
      <p>
      Percentage of students at low, some, or high risk for the Emotional Domain on the mySAEBRS 
      (i.e., Student self-report). The Emotional Domain assesses student ability to regulate internal states, 
      adapt to change, and respond to stressful/challenging events.
      </p>
    </>
  )
}

export function SaebrsSocialTooltip() {
  return (
    <>
      <p>
      Percentage of students at low, some, or high risk for the Social Domain on the SAEBRS-TRS 
      (i.e., Teacher rating). The Social Domain assesses student ability to understand social norms, 
      empathize, and understand the perspectives of others
      </p>
    </>
  )
}

export function MySaebrsSocialTooltip() {
  return (
    <>
      <p>
      Percentage of students at low, some, or high risk for the Social Domain on the mySAEBRS 
      (i.e., Student self-report). The Social Domain assesses student ability to understand social norms, 
      empathize, and understand the perspectives of others.
      </p>
    </>
  )
}

export function SaebrsAcademicTooltip() {
  return (
    <>
      <p>
      Percentage of students at low, some, or high risk for the Academic Domain on the SAEBRS-TRS 
      (i.e., Teacher rating). The Academic Domain assesses skills necessary for students to be 
      prepared for, participate in, and benefit from academic instruction.
      </p>
    </>
  )
}

export function MySaebrsAcademicTooltip() {
  return (
    <>
      <p>
      Percentage of students at low, some, or high risk for the Academic Domain on the mySAEBRS 
      (i.e., Student self-report). The Academic Domain assesses skills necessary for students to 
      be prepared for, participate in, and benefit from academic instruction.
      </p>
    </>
  )
}
