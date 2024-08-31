// import { getChatToFile } from '@/app/actions/get-chat-to-file';
// import { ChatInterface } from '@/components/chat-interface';
// import { FileInfo } from '@/components/file-info';

async function ChatToFilePage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  //   const chatToFile = await getChatToFile(id);

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* <FileInfo file={chatToFile.file} /> */}
      {/* <ChatInterface chatId={id} initialMessages={chatToFile.messages} /> */}
      <div>
        <h1>Chat to File</h1>
      </div>
    </div>
  );
}

export default ChatToFilePage;
