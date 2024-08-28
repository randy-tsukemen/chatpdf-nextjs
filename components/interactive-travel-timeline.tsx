"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  PlaneIcon,
  TrainIcon,
  CarIcon,
  ShipIcon,
  MapPinIcon,
} from "lucide-react";

const icons = {
  plane: PlaneIcon,
  train: TrainIcon,
  car: CarIcon,
  ship: ShipIcon,
};

const initialTimelineEvents = [
  {
    id: "event1",
    title: "Flight to Paris",
    date: "June 1, 2024",
    description: "Departing from JFK Airport to Charles de Gaulle Airport",
    icon: "plane",
    color: "bg-blue-500",
  },
  {
    id: "event2",
    title: "Train to Lyon",
    date: "June 3, 2024",
    description: "Taking the TGV from Paris to Lyon",
    icon: "train",
    color: "bg-green-500",
  },
];

const initialPoolPlaces = [
  {
    id: "place1",
    title: "Drive to Marseille",
    description: "Rent a car and drive from Lyon to Marseille",
    icon: "car",
    color: "bg-yellow-500",
  },
  {
    id: "place2",
    title: "Cruise to Naples",
    description: "Board a cruise ship from Marseille to Naples",
    icon: "ship",
    color: "bg-purple-500",
  },
  {
    id: "place3",
    title: "Visit Rome",
    description: "Take a train from Naples to Rome",
    icon: "train",
    color: "bg-red-500",
  },
];

export default function InteractiveTravelTimeline() {
  const [timelineEvents, setTimelineEvents] = useState(initialTimelineEvents);
  const [poolPlaces, setPoolPlaces] = useState(initialPoolPlaces);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same list
      const items = Array.from(
        source.droppableId === "timeline" ? timelineEvents : poolPlaces
      );
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      if (source.droppableId === "timeline") {
        setTimelineEvents(items);
      } else {
        setPoolPlaces(items);
      }
    } else {
      // Moving between lists
      const sourceItems = Array.from(
        source.droppableId === "timeline" ? timelineEvents : poolPlaces
      );
      const destItems = Array.from(
        destination.droppableId === "timeline" ? timelineEvents : poolPlaces
      );
      const [movedItem] = sourceItems.splice(source.index, 1);

      if (destination.droppableId === "timeline") {
        // Add a date when moving to timeline
        movedItem.date = new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      } else {
        // Remove date when moving back to pool
        delete movedItem.date;
      }

      destItems.splice(destination.index, 0, movedItem);

      setTimelineEvents(
        destination.droppableId === "timeline" ? destItems : sourceItems
      );
      setPoolPlaces(
        destination.droppableId === "pool" ? destItems : sourceItems
      );
    }
  };

  const renderEvent = (event, index, isDraggingOver, isTimeline) => {
    const IconComponent = icons[event.icon] || MapPinIcon;

    return (
      <Draggable key={event.id} draggableId={event.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-4 flex ${snapshot.isDragging ? "opacity-50" : ""}`}
          >
            <div className="flex flex-col items-center mr-4">
              <Avatar className={`${event.color} h-8 w-8`}>
                <AvatarFallback>
                  <IconComponent className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              {isTimeline && index < timelineEvents.length - 1 && (
                <Separator orientation="vertical" className="h-full mt-2" />
              )}
            </div>
            <Card className="flex-grow">
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {event.date && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.date}
                  </p>
                )}
                <p className="text-sm">{event.description}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 pr-0 md:pr-4 mb-8 md:mb-0">
          <h1 className="text-2xl font-bold mb-6">My Travel Itinerary</h1>
          <Droppable droppableId="timeline">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`min-h-[300px] p-4 rounded-lg ${
                  snapshot.isDraggingOver ? "bg-secondary" : "bg-background"
                }`}
              >
                {timelineEvents.map((event, index) =>
                  renderEvent(event, index, snapshot.isDraggingOver, true)
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className="w-full md:w-1/3">
          <h2 className="text-xl font-bold mb-6">Available Places</h2>
          <Droppable droppableId="pool">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`min-h-[300px] p-4 rounded-lg ${
                  snapshot.isDraggingOver ? "bg-secondary" : "bg-background"
                }`}
              >
                {poolPlaces.map((place, index) =>
                  renderEvent(place, index, snapshot.isDraggingOver, false)
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}
