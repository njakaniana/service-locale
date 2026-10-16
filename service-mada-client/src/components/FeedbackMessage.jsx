export default function FeedbackMessage({ message, type = "error" }) {
  if (!message) return null;

  return (
    <div className={`feedback-message feedback-${type}`} role={type === "error" ? "alert" : "status"}>
      {message}
    </div>
  );
}
