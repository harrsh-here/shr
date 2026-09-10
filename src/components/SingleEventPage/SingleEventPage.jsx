import { useEffect } from "react";
import classes from "./SingleEventPage.module.css";
import { parseContact, telHref } from "../../utils/contactInfo";
import { useParams, useNavigate } from "react-router-dom";
import { eventsData } from "../../assets/eventsData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faIdCard } from "@fortawesome/free-solid-svg-icons";

const SingleEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Lock background scrolling when modal opens
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const requiredEvent = eventsData.find((event) => event.id === +eventId);

  if (!requiredEvent) {
    return (
      <div className={classes.singleEvent}>
        <div className={classes.singleEventCard}>
          <h2 style={{ color: "white" }}>Event not found</h2>
          <button onClick={() => navigate("/")} className={classes.backBtn}>Go Back</button>
        </div>
      </div>
    )
  }

  const {
    name,
    category,
    image,
    description,
    rules,
    prizes,
    minMembers,
    maxMembers,
    price,
    feePerPerson,
    contactInfo,
    location,
    mapUrl,
    date,
    link,
    onSpot,
    disqualification,
    isSpecial,
    rulebookLink,
  } = requiredEvent;

  return (
    <div className={classes.singleEvent}>
      {/* Close Button moved outside the scrolling card */}
      <button className={classes.closeBtn} onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <div className={classes.singleEventCard}>

        <div className={classes.col1}>
          <div className={classes.posterWrapper}>
            <img className={classes.eventPoster} src={image} alt={name} loading="lazy" decoding="async" />
          </div>
          <div className={classes.rulebookBtnContainer}>
            {rulebookLink ? (
              <a
                href={rulebookLink}
                target="_blank"
                rel="noopener noreferrer"
                download="Shraddhanjali-2026-Brochure.pdf"
                className={classes.downloadBtn}
              >
                ↓ Download Brochure
              </a>
            ) : (
              <button type="button" className={`${classes.downloadBtn} ${classes.disabledDownload}`} disabled>
                Brochure · Coming Soon
              </button>
            )}
          </div>
        </div>

        <div className={classes.col2}>
          {category && <p className={classes.eventCategory}>{category}</p>}
          <h1 className={classes.eventHeading}>{name}</h1>

          <div className={classes.sectionWrap}>
            <h2 className={classes.heading}>Description</h2>
            <p className={`${classes.content} ${classes.descContent}`}>{description}</p>
          </div>

          <div className={classes.rowcol}>
            <div className={classes.sectionWrap}>
              <h2 className={classes.heading}>Team Size</h2>
              <p className={classes.content}>Min {minMembers} · Max Participants {maxMembers}</p>
            </div>

            <div className={classes.sectionWrap}>
              <h2 className={classes.heading}>Fees</h2>

              <p className={classes.content}>{feePerPerson ? `₹${feePerPerson} per person` : price === 0 ? 'Free' : `₹${price}`}</p>
            </div>
          </div>

          {rules?.length > 0 && (
            <div className={classes.sectionWrap}>
              <h2 className={classes.heading}>Rules & Guidelines</h2>
              <ul className={classes.list}>
                {rules.map((rule, i) => <li key={i} className={classes.content}>{rule}</li>)}
              </ul>
            </div>
          )}

          <div className={classes.rowcol}>
            <div className={classes.sectionWrap}>
              <h2 className={classes.heading}>Location</h2>
              {mapUrl ? <a href={mapUrl} target="_blank" rel="noreferrer noopener" className={classes.locationLink}>{location}<span>Open in Google Maps ↗</span></a> : <p className={classes.content}>{location}</p>}
            </div>
            <div className={classes.sectionWrap}>
              <h2 className={classes.heading}>Date & Time</h2>
              <p className={classes.content}>{date}</p>
            </div>
          </div>

          {prizes && (
            <div className={classes.sectionWrap}>
              <h2 className={classes.headingp}>Prizes</h2>
              <ul className={classes.list}>
                {prizes?.map((prize, i) => (
                  <li key={i} className={classes.content}>{prize}</li>
                ))}
              </ul>
            </div>
          )}

          {disqualification && (
            <div className={classes.sectionWrap}>
              <h2 className={classes.heading}>Disqualification</h2>
              <ul className={classes.list}>
                {disqualification?.map((rule, i) => (
                  <li key={i} className={classes.content}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {contactInfo && contactInfo.length > 0 && (
            <div className={classes.sectionWrap}>
              <h2 className={classes.heading}>Contact Info</h2>
              {contactInfo?.map((contact, i) => {
                const { name: contactName, phone } = parseContact(contact);
                return (
                  <p key={i} className={classes.content}>
                    {contactName}
                    {phone && (
                      <>
                        {' — '}
                        <a href={telHref(phone)} className={classes.phoneLink}>{phone}</a>
                      </>
                    )}
                  </p>
                );
              })}
            </div>
          )}



          <div className={classes.idNotice}>
            <FontAwesomeIcon icon={faIdCard} className={classes.idNoticeIcon} />
            <p>
              <strong>Carry a physical photo ID on event day.</strong> Every team member must bring
              their original college ID card or a government ID (Aadhaar, Driving Licence, etc.).
              Digital copies and photographs are not accepted at the reporting desk.
            </p>
          </div>

          <div className={classes.actionFooter}>
            {(isSpecial && link !== "#") ? (
              link !== "" ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={classes.registerBtn}
                >
                  Register Now
                </a>
              ) : (
                <p className={classes.soon}>Registration will be open soon.</p>
              )
            ) : link !== "" ? (
              <button className={classes.registerBtn} onClick={() => navigate(`/register/${eventId}`)}>
                Register for {name}
              </button>
            ) : onSpot !== "" ? (
              <p className={classes.soon}>Registration will be taken on spot!</p>
            ) : (
              <p className={classes.soon}>Registration will be open soon.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SingleEventPage;
