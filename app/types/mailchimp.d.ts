declare module '@mailchimp/mailchimp_marketing' {
  interface MailchimpClient {
    setConfig: (config: {
      apiKey: string;
      server: string;
    }) => void;
    lists: {
      addListMember: (listId: string, data: {
        email_address: string;
        status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending';
      }) => Promise<{
        id: string;
        email_address: string;
        unique_email_id: string;
        status: string;
      }>;
    };
  }

  const mailchimp: MailchimpClient;
  export default mailchimp;
}
