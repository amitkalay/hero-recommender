import { createFileRoute } from "@tanstack/react-router";
import { HeroPickerLanding } from "@/components/HeroPickerLanding";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <HeroPickerLanding />;
}
