export async function handler(event) {
  console.log(
    "\n>>>>>>>>>>>>>>>>>>>> Receiving message <<<<<<<<<<<<<<<<<<<<\n",
  );
  event.Records.forEach((record, i) => {
    console.log(
      `\n>>>>>>>>>>>>>>>>>>>> Receiving record ${i} <<<<<<<<<<<<<<<<<<<<\n`,
    );
    console.log("Record:", record);
    console.log(
      "\n>>>>>>>>>>>>>>>>>>>> Printing attributes <<<<<<<<<<<<<<<<<<<<\n",
    );
    const { body: recordBody, attributes } = record;
    const { SentTimestamp } = attributes;
    console.log(recordBody, new Date(+SentTimestamp).toLocaleString());
  });
}
