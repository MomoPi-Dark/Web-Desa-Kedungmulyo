import ErrorPage from "@/components/pages/ErrorPage";
import { cn } from "@/lib/utils";

const UnkownPage = ({
  routeBack,
  className,
}: {
  routeBack?: string;
  className?: string;
}) => {
  const messages = [
    "Have you lost your way, kiddo?",
    "Damn it! This dead-end road.",
    "The Aurors blocked this road, Harry!",
  ];

  return (
    <div className={cn(className)}>
      <ErrorPage
        routeBack={routeBack}
        code={404}
        message={
          messages[Math.floor(Math.random() * messages.length)] ||
          "Page not found."
        }
      />
    </div>
  );
};

export default UnkownPage;
