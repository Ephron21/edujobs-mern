interface IAnnouncement {
  _id: string;
  title: string;
  content: string;
  mediaUrl?: string;
}

const AnnouncementCard = ({ announcement }: { announcement: IAnnouncement }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
      <p className="text-gray-700 mb-4">{announcement.content}</p>
      {announcement.mediaUrl && (
        <div className="mt-4">
          {announcement.mediaUrl.endsWith('.mp4') ? (
            <video src={announcement.mediaUrl} controls className="max-w-full h-auto rounded" />
          ) : (
            <img src={announcement.mediaUrl} alt={announcement.title} className="max-w-full h-auto rounded" />
          )}
        </div>
      )}
    </div>
  );
};

export default AnnouncementCard;
