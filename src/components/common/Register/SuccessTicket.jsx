import React, { useRef, useState } from 'react';
import classes from './Register.module.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PrintableTicket from './PrintableTicket';
import { eventsData } from '../../../assets/eventsData';

const SuccessTicket = ({ data }) => {
    const ticketRef = useRef(null);

    const {
        fullName,
        selectedEvents,
        teamMembers,
        utr,
        totalAmount,
        registrationId
    } = data;

    const [isDownloading, setIsDownloading] = useState(false);
    const printableRef = useRef(null);

    const handleDownload = async () => {
        if (!printableRef.current) return;

        try {
            setIsDownloading(true);

            // Generate canvas from the hidden printable component
            const canvas = await html2canvas(printableRef.current, {
                scale: 2, // High resolution
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);

            // Calculate dimensions for A4 page
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate how tall the canvas is when scaled to the PDF width
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            // Loop to add new pages if the image is taller than one A4 page
            while (heightLeft > 0) {
                position = heightLeft - imgHeight; // Shift the image up for the next page
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`Shraddhanjali2026_Tickets_${registrationId}.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className={classes.ticketContainer}>
            <div className={classes.ticketWrapper} ref={ticketRef}>
                <div className={classes.ticketHeader}>
                    <div className={classes.ticketCircles}>
                        <span></span>
                        <span></span>
                    </div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '5px', background: 'linear-gradient(135deg, #a88bff, #2fc2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ARYA Shraddhanjali 2026</h1>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>🎉 Thank You For Registering</h2>
                </div>

                <div className={classes.ticketBody}>
                    <div className={classes.ticketSection}>
                        <span className={classes.ticketLabel}>Participant Name</span>
                        <span className={classes.ticketValue}>{fullName}</span>
                    </div>

                    <div className={classes.ticketRow}>
                        <div className={classes.ticketSection}>
                            <span className={classes.ticketLabel}>Events Selected</span>
                            <span className={classes.ticketValue}>{selectedEvents.length}</span>
                        </div>

                        <div className={classes.ticketSection}>
                            <span className={classes.ticketLabel}>Total Paid</span>
                            <span className={classes.ticketValueHighlight}>₹{totalAmount}</span>
                        </div>

                        {utr && (
                            <div className={classes.ticketSection}>
                                <span className={classes.ticketLabel}>Transaction ID</span>
                                <span className={classes.ticketValue} style={{ fontSize: '16px' }}>{utr}</span>
                            </div>
                        )}
                    </div>

                    <div className={classes.ticketBadge} style={{ marginTop: '15px' }}>
                        <span className={classes.ticketLabel}>Registration ID</span>
                        <span className={classes.ticketId}>{registrationId}</span>
                    </div>

                    <div className={classes.eventsOverviewSection}>
                        <span className={classes.ticketLabel} style={{ marginTop: '20px', display: 'block', fontSize: '15px' }}>Events Registered ({selectedEvents.length})</span>
                        <ul className={classes.eventListCompact}>
                            {selectedEvents.map((eventName, i) => (
                                <li key={i} className={classes.eventListItem}>
                                    <strong>{eventName}</strong>
                                    {teamMembers && teamMembers[eventName] && teamMembers[eventName].length > 0 && (
                                        <div className={classes.teamMemberList}>
                                            <span className={classes.teamLabel}>Team: </span>
                                            {teamMembers[eventName].join(', ')}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={classes.ticketFooter}>
                    <div className={classes.festDetails}>
                        <h3>Shraddhanjali 2026</h3>
                        <p>13–15 March</p>
                    </div>
                </div>
            </div>

            <p className={classes.ticketHelpText}>Take a screenshot of this digital ticket for your records.</p>

            <button
                onClick={handleDownload}
                className={classes.downloadBtn}
                disabled={isDownloading}
            >
                {isDownloading ? 'Generating PDF...' : 'Download All Tickets (PDF)'}
            </button>

            {/* Hidden printable component */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <PrintableTicket
                    ref={printableRef}
                    registrationData={data}
                    eventsList={eventsData}
                />
            </div>
        </div>
    );
};

export default SuccessTicket;
