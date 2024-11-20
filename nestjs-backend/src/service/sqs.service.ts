import { Injectable } from '@nestjs/common';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, SendMessageCommand } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService {
  private sqsClient: SQSClient;
  private queueUrl: string = process.env.SQS_QUEUE_URL;

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async sendMessage(messageBody: string) {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: messageBody,
    });

    try {
      const data = await this.sqsClient.send(command);
      console.log('Message sent to SQS:', data.MessageId);
    } catch (error) {
      console.error('Error sending message to SQS:', error);
    }
  }

  async receiveMessage() {
    const command = new ReceiveMessageCommand({
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 10, 
    });

    try {
      const response = await this.sqsClient.send(command);
      return response.Messages ? response.Messages[0] : null;
    } catch (error) {
      console.error('Error receiving message from SQS:', error);
      return null;
    }
  }

  async deleteMessage(receiptHandle: string) {
    const command = new DeleteMessageCommand({
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    });

    try {
      await this.sqsClient.send(command);
      console.log('Message deleted from SQS');
    } catch (error) {
      console.error('Error deleting message from SQS:', error);
    }
  }
}
