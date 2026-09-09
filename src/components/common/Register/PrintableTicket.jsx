import React, { forwardRef } from 'react';
import classes from './PrintableTicket.module.css';

const PrintableTicket = forwardRef(({ registrationData, eventsList }, ref) => {
    const { fullName, selectedEvents, teamMembers, utr, registrationId } = registrationData;

    // Filter eventsList to only include the events the user registered for
    const registeredEventsData = eventsList.filter(event =>
        selectedEvents.includes(event.name)
    );

    return (
        <div ref={ref} className={classes.printableContainer}>
            {registeredEventsData.map((event, index) => (
                <div key={index} className={classes.subTicket}>
                    {/* Header: Fest branding */}
                    <div className={classes.ticketHeader}>
                        <h1 className={classes.festName}>ARYA Shraddhanjali 2026</h1>
                        <p className={classes.festDates}>13–15 March 2026</p>
                    </div>

                    {/* Body: Event and user info */}
                    <div className={classes.ticketBody}>
                        <h2 className={classes.eventName}>{event.name}</h2>
                        <div className={classes.eventDetails}>
                            {event.location && <p><strong>Venue:</strong> {event.location}</p>}
                            {event.date && <p><strong>Date & Time:</strong> {event.date}</p>}
                            <p><strong>Type:</strong> Team Event</p>
                        </div>

                        <div className={classes.divider}></div>

                        <div className={classes.participantDetails}>
                            <div className={classes.detailRow}>
                                <span className={classes.label}>Registered Participant:</span>
                                <span className={classes.value}>{fullName}</span>
                            </div>
                            <div className={classes.detailRow} style={{ alignItems: 'flex-end' }}>
                                <span className={classes.label}>Registration / Txn ID:</span>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                    <span className={classes.valueId}>{registrationId}</span>
                                    <span className={classes.valueUtr}>{utr}</span>
                                </div>
                            </div>
                        </div>

                        {/* Team Members Section */}
                        {event.type === 'team_fixed' && teamMembers && teamMembers[event.name] && teamMembers[event.name].length > 0 && (
                            <div className={classes.teamSection}>
                                <div className={classes.divider} style={{ margin: '15px 0' }}></div>
                                <span className={classes.label}>Team Members:</span>
                                <div className={classes.teamList}>
                                    {teamMembers[event.name].map((member, idx) => (
                                        <div key={idx} className={classes.teamMemberItem}>
                                            <span className={classes.memberDot}>•</span> {member}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Barcode decoration */}
                    <div className={classes.ticketFooter}>
                        <div className={classes.barcodeFake}>
                            || ||| || ||| | ||| || || ||| ||| || | ||
                        </div>
                        <p className={classes.passText}>PARTICIPANT ENTRY PASS</p>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default PrintableTicket;
