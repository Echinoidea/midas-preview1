import * as React from 'react';

interface EmailTemplateProps {
  link: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  link,
}) => (
  <div>
    <h1>Welcome Mate!</h1>
    <img src={link} alt="Default image" />
  </div>
);
