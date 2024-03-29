import { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ColorPicker , ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, Textarea, Select, ColorModeProvider } from "@chakra-ui/react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import "../index.css";
import { useParams } from 'react-router-dom';
import useCalendarStore from '../store/calendar';

function Calendar() {
    const { createEvent, getEventsByCalendarId, deleteEvent } = useCalendarStore();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
    const [isEventInfoModalOpen, setIsEventInfoModalOpen] = useState(false);
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventColor, setEventColor] = useState('');
    const [eventCategory, setEventCategory] = useState('reminder');
    const { calendarId } = useParams();
    const events = useCalendarStore((state) => state.events[calendarId] || []);

    const handleColorChange = (event) => {
        const newColor = event.target.value;
        setEventColor(newColor);
      };

    function handleDateSelect(selectInfo) {
        setSelectedEvent({
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
        });
        setIsCreateEventModalOpen(true);
    }

    function handleEventClick(clickInfo) {
        setSelectedEvent(clickInfo.event);
        setIsEventInfoModalOpen(true);
    }

    function handleCloseModal() {
        setIsCreateEventModalOpen(false);
        setIsEventInfoModalOpen(false);
        setSelectedEvent(null);
        setEventName('');
        setEventDescription('');
        setEventColor('');
        setEventCategory('reminder');
    }

    async function handleCreateEvent() {
        const newEvent = {
            title: eventName,
            description: eventDescription,
            category: eventCategory,
            backgroundColor: eventColor,
            start: selectedEvent.start,
            end: selectedEvent.end,
            calendarId: calendarId,
            allDay: selectedEvent.allDay
        };
        await createEvent(newEvent, calendarId);
        setIsCreateEventModalOpen(false);
    }

    async function handleDeleteEvent() {
        try {
            await deleteEvent(selectedEvent.id, calendarId);
            setIsEventInfoModalOpen(false);
        } catch(error) {
            console.log('Error deleting event:', error);
        }
    }

    return (
        <div>
          <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                initialView='dayGridMonth'
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                aspectRatio={1.5}
                height='100vh'
                contentHeight={400}
                windowResize={() => console.log('window was resized')}
                select={handleDateSelect}
                eventClick={handleEventClick}
                events={events}
            />

         
            <Modal isOpen={isCreateEventModalOpen} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Event</ModalHeader>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input value={eventName} onChange={(e) => setEventName(e.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Category</FormLabel>
                            <Select value={eventCategory} onChange={(e) => setEventCategory(e.target.value)}>
                                <option value="reminder">Reminder</option>
                                <option value="task">Task</option>
                                <option value="arrangment">Arrangement</option>
                            </Select>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Color</FormLabel>
                            <Input
                                type="color"
                                value={eventColor}
                                onChange={handleColorChange}
                                width="100%"
                            />
                            </FormControl>
                            <p>Start: {new Date(selectedEvent?.start).toLocaleDateString()}, {new Date(selectedEvent?.start).toLocaleTimeString()}</p>
                            <p>End: {new Date(selectedEvent?.end).toLocaleDateString()}, {new Date(selectedEvent?.end).toLocaleTimeString()}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleCreateEvent}>
                            Save
                        </Button>
                        <Button onClick={handleCloseModal}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        
            <Modal isOpen={isEventInfoModalOpen} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Event Information</ModalHeader>
                    <ModalBody>
                      <p>Title: {selectedEvent?.title}</p>
                      <p>Description: {selectedEvent?.extendedProps?.description}</p>
                      <p>Category: {selectedEvent?.extendedProps?.category}</p>
                      <p>Start: {selectedEvent?.start?.toLocaleString()}</p>
                      <p>End: {selectedEvent?.end?.toLocaleString()}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={handleDeleteEvent}>
                            Delete Event
                        </Button>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default Calendar;