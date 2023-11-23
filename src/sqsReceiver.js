export async function handler(event) {
  console.log(">>>>>>>>>>>>>>>>>>>> Receiving message <<<<<<<<<<<<<<<<<<<<");
  event.Records.forEach((record) => {
    console.log("Record:", record);
    console.log(
      ">>>>>>>>>>>>>>>>>>>> Printing attributes <<<<<<<<<<<<<<<<<<<<",
    );
    const { body: recordBody, attributes } = record;
    const { SentTimestamp } = attributes;
    console.log(recordBody, new Date(+SentTimestamp).toLocaleString());
  });
}
