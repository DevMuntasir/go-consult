import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Camera,
  CameraOff,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  FileHeart,
  FileText,
  Globe2,
  Headphones,
  Heart,
  HeartPulse,
  History,
  Home,
  Languages,
  LockKeyhole,
  Menu,
  Mic,
  MicOff,
  MoreHorizontal,
  PhoneOff,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Thermometer,
  UserRound,
  Users,
  Video,
  Wallet,
  Wifi,
  X,
} from 'lucide-react';
import mock from './data/mock.json';
import './style.css';

type Screen =
  | 'home'
  | 'intake'
  | 'review'
  | 'matching'
  | 'call'
  | 'complete'
  | 'history'
  | 'profile'
  | 'doctor';
type Country = (typeof mock.countries)[number];
type Doctor = (typeof mock.doctors)[number];
type Tab = 'home' | 'history' | 'profile';
const icons = {
  general: Stethoscope,
  cold: Thermometer,
  skin: Sparkles,
  wellness: Heart,
};

function App() {
  const [country, setCountry] = useState<Country>(mock.countries[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [intakeStep, setIntakeStep] = useState(0);
  const [patientName, setPatientName] = useState(mock.patient.name);
  const [age, setAge] = useState(mock.patient.age);
  const [symptoms, setSymptoms] = useState('');
  const [specialty, setSpecialty] = useState('general');
  const [consent, setConsent] = useState(false);
  const [doctor, setDoctor] = useState<Doctor>(mock.doctors[0]);
  const [online, setOnline] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [matchPhase, setMatchPhase] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [notification, setNotification] = useState('');
  const [serviceLanguage, setServiceLanguage] = useState('English');
  const [completed, setCompleted] = useState(false);
  const [search, setSearch] = useState('');
  const go = (s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  useEffect(() => {
    setServiceLanguage(country.languages[0]);
    const candidate = mock.doctors.find((d) => d.country === country.code);
    if (candidate) setDoctor(candidate);
  }, [country]);
  useEffect(() => {
    if (screen !== 'matching') return;
    setMatchPhase(0);
    const a = setTimeout(() => setMatchPhase(1), 2200);
    const b = setTimeout(() => setMatchPhase(2), 4900);
    const c = setTimeout(() => {
      setMatchPhase(3);
      setCallSeconds(0);
      go('call');
    }, 7200);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
    };
  }, [screen]);
  useEffect(() => {
    if (screen !== 'call') return;
    const t = setInterval(() => setCallSeconds((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [screen]);
  const notify = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };
  const start = () => {
    setConsent(false);
    setIntakeStep(0);
    go('intake');
  };
  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  const tabScreen: Tab =
    screen === 'history'
      ? 'history'
      : screen === 'profile'
        ? 'profile'
        : 'home';
  const shellClass = screen === 'call' ? 'app-shell calling' : 'app-shell';
  return (
    <div className="site">

      <div className="device">
        <main className={shellClass}>
          {notification && (
            <div className="toast">
              <Check size={16} />
              {notification}
            </div>
          )}
          {screen === 'home' && (
            <>
          
              <div className="home-content">
                <div className="greeting">
                  <div>
                    <span className="overline">
                      GOOD MORNING <span>✳</span>
                    </span>
                    <h2>
                      How are you feeling <span>today?</span>
                    </h2>
                  </div>
                  <button className="avatar" onClick={() => go('profile')}>
                    {mock.patient.initials}
                  </button>
                </div>
                <section className="hero">
                  <div className="hero-copy">
                    {/* <span className="hero-chip">
                      <span className="live-dot" /> CARE IS AVAILABLE
                    </span> */}
                    <h1>
                      Expert care,
                      <br />
                      wherever
                      <br />
                      you are.
                    </h1>
                    {/* <p>Connect with a qualified doctor without leaving home.</p> */}
                  </div>
                  <img
                    className="hero-doctor"
                    src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&h=800&fit=crop&crop=faces"
                    alt="Smiling health professional"
                  />
                  <div className="hero-glow" />
                </section>
                <section className="action-card">
                  {/* <div className="action-top">
                    <span className="availability">
                      <span className="live-d" /> Doctors available now
                    </span>
                    <span className="fee-pill">
                      From {country.currency}
                      {country.fee}
                    </span>
                  </div> */}
                  <button
                    className="primary-button consult-button"
                    onClick={start}
                  >
                    <Video size={20} fill="currentColor" strokeWidth={2} />{' '}
                    Consult a doctor now <ArrowRight size={20} />
                  </button>
                  
                </section>
                <div className="section-heading">
                  <h3>What do you need help with?</h3>
                  <span>Explore care</span>
                </div>
                <div className="specialty-grid">
                  {mock.specialties.map((s) => {
                    const Icon = icons[s.id as keyof typeof icons];
                    return (
                      <button
                        key={s.id}
                        className="specialty"
                        onClick={() => {
                          setSpecialty(s.id);
                          start();
                        }}
                      >
                        <span className="specialty-icon">
                          <Icon size={22} />
                        </span>
                        <strong>{s.name}</strong>
                        <small>{s.description}</small>
                        <ChevronRight className="specialty-arrow" size={16} />
                      </button>
                    );
                  })}
                </div>
                <div className="section-heading bottom-heading">
                  <h3>Care that works for you</h3>
                </div>
                <div className="trust-card">
                  <div className="trust-icon">
                    <Heart size={22} />
                  </div>
                  <div>
                    <strong>Care from wherever you are</strong>
                    <p>Real doctors. Real conversations. No waiting rooms.</p>
                  </div>
                  <ArrowRight size={18} />
                </div>
              </div>
            </>
          )}
          {screen === 'intake' && (
            <>
              <SubHeader
                title="Start a consultation"
                back={() => {
                  if (intakeStep === 0) go('home');
                  else setIntakeStep((v) => v - 1);
                }}
              />
              <div className="form-page">
                <div className="steps">
                  <span className={intakeStep >= 0 ? 'filled' : ''} />
                  <span className={intakeStep >= 1 ? 'filled' : ''} />
                </div>
                <div className="step-label">
                  STEP {intakeStep + 1} OF 2 <span>~1 MIN TO COMPLETE</span>
                </div>
                {intakeStep === 0 ? (
                  <>
                   
                
                    {/* <p className="muted">
                      We’ll use these details to connect you with the right
                      doctor.
                    </p> */}
                    <label className="field-label">Your full name</label>
                    <input
                      className="text-field"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter your name"
                    />
                    <label className="field-label">Your age</label>
                    <input
                      className="text-field"
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter your age"
                    />
                    <label className="field-label">Preferred language</label>
                    <select
                      className="text-field"
                      value={serviceLanguage}
                      onChange={(e) => setServiceLanguage(e.target.value)}
                    >
                      {country.languages.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    {/* <div className="form-visual purple">
                      <span>
                        <HeartPulse size={27} />
                      </span>
                    </div> */}
                    {/* <h1>
                      Tell us what's
                      <br />
                      <em>going on.</em>
                    </h1> */}
                    {/* <p className="muted">
                      A few details will help your doctor prepare for your
                      visit.
                    </p> */}
                    <label className="field-label">
                      What can we help with?
                    </label>
                    <textarea
                      className="text-field symptom-field"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Briefly describe how you're feeling…"
                    />
                    <div className="suggestion-label">QUICK SUGGESTIONS</div>
                    <div className="chips">
                      {mock.symptomSuggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSymptoms(s)}
                          className={symptoms === s ? 'chip selected' : 'chip'}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="safety-note">
                      <CircleHelp size={18} />
                      <span>
                        If you are experiencing a medical emergency, contact
                        your local emergency service instead of using this demo.
                      </span>
                    </div>
                  </>
                )}
                <div className="form-actions">
                  <button
                    className="primary-button"
                    disabled={
                      intakeStep === 0
                        ? !patientName.trim() || !age || Number(age) < 1
                        : !symptoms.trim()
                    }
                    onClick={() =>
                      intakeStep === 0 ? setIntakeStep(1) : go('review')
                    }
                  >
                    Continue <ArrowRight size={19} />
                  </button>
                </div>
              </div>
            </>
          )}
          {screen === 'review' && (
            <>
              <SubHeader title="Review & confirm" back={() => go('intake')} />
              <div className="review-page">
                {/* <span className="eyebrow dark">YOU’RE ALMOST THERE</span> */}
                {/* <h1>
                  Great! Let’s
                  <br />
                  <em>get you care.</em>
                </h1>
                <p className="muted">
                  Review your details before we find your doctor.
                </p> */}
                <div className="review-doctor">
                  <img src={doctor.photo} />
                  <div>
                    <span className="availability">
                      <span className="live-dot" /> QUALIFIED LOCAL CARE
                    </span>
                    <strong>General consultation</strong>
                    <small>A verified doctor from {country.name}</small>
                  </div>
                </div>
                <div className="review-card">
                  <div className="review-row">
                    <span>Patient</span>
                    <strong>{patientName}</strong>
                  </div>
                  <div className="review-row">
                    <span>Age</span>
                    <strong>{age} years</strong>
                  </div>
                  <div className="review-row">
                    <span>Consultation</span>
                    <strong>Video call</strong>
                  </div>
                  <div className="review-row">
                    <span>Preferred language</span>
                    <strong>{serviceLanguage}</strong>
                  </div>
                  <div className="divider" />
                  <div className="review-row total">
                    <span>Consultation fee</span>
                    <strong>
                      {country.currency}
                      {country.fee}
                    </strong>
                  </div>
                </div>
                <div className="payment-method">
                  <div className="payment-icon">
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <strong>Demo payment</strong>
                    <small>No real charge — simulated checkout</small>
                  </div>
                  <CheckCircle2 size={20} />
                </div>
                <label className="consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>
                    I understand this is a UI demo and agree to proceed with a
                    simulated consultation.
                  </span>
                </label>
                <button
                  className="primary-button"
                  disabled={!consent}
                  onClick={() => go('matching')}
                >
                  <LockKeyhole size={17} /> Confirm & find my doctor{' '}
                  <ArrowRight size={18} />
                </button>
                <p className="safe-footer">
                  <ShieldCheck size={15} /> This prototype never processes real
                  payments.
                </p>
              </div>
            </>
          )}
          {screen === 'matching' && (
            <div className="matching-screen">
              <button
                className="light-back"
                onClick={() => setShowCancel(true)}
              >
                <X size={22} />
              </button>
              <div className="match-main">
                <div className="match-orbit">
                  <div className="orbit-one" />
                  <div className="orbit-two" />
                  <img src={doctor.photo} alt="Matching doctor" />
                  <div className="orbit-check">
                    <Check size={20} />
                  </div>
                </div>
                {/* <div className="match-tag">
                  <span className="live-dot" /> SEARCH IN PROGRESS
                </div> */}
                <h1>
                  {matchPhase < 2
                    ? 'Finding your perfect match…'
                    : 'Your doctor is ready!'}
                </h1>
                {/* <p>
                  {matchPhase < 2
                    ? 'We’re connecting you with a verified doctor in your country.'
                    : 'Getting your private consultation room ready.'}
                </p> */}
                <div className="match-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="match-progress">
                <div className="match-line">
                  <CheckCircle2 size={19} /> Payment verified{' '}
                  <Check size={17} />
                </div>
                <div className="match-line">
                  <CheckCircle2 size={19} /> Finding an available doctor{' '}
                  {matchPhase >= 1 ? (
                    <Check size={17} />
                  ) : (
                    <span className="spinner" />
                  )}
                </div>
                <div
                  className={'match-line ' + (matchPhase >= 2 ? '' : 'pending')}
                >
                  <Video size={19} /> Connecting video{' '}
                  {matchPhase >= 2 ? <Check size={17} /> : <span>Waiting</span>}
                </div>
              </div>
              {showCancel && (
                <div className="modal-backdrop">
                  <div className="modal">
                    <h3>Cancel consultation?</h3>
                    <p>
                      Your demo consultation will be cancelled. No payment has
                      been made.
                    </p>
                    <div className="modal-buttons">
                      <button onClick={() => setShowCancel(false)}>
                        Keep waiting
                      </button>
                      <button
                        onClick={() => {
                          setShowCancel(false);
                          go('home');
                        }}
                      >
                        Cancel request
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {screen === 'call' && (
            <div className="video-room">
              <img
                className="call-doctor"
                src={doctor.photo}
                alt="Doctor demo still image"
              />
              <div className="video-overlay" />
              <div className="call-header">
                <span className="call-secure">
                  <ShieldCheck size={15} /> Demo consultation
                </span>
                <span className="call-duration">
                  <span className="live-dot" /> {formatTime(callSeconds)}
                </span>
              </div>
              <div className="call-bottom">
                <div className="call-doctor-info">
                  {/* <span>CONNECTED TO</span> */}
                  <h2>{doctor.name}</h2>
                  <p>
                    {doctor.role} · {country.name}
                  </p>
                </div>
                <div className="self-preview">
                  <div>
                    <UserRound size={34} />
                  </div>
                  <span>{cameraOff ? 'Camera off' : 'You · preview'}</span>
                </div>
                <div className="call-controls">
                  <button
                    onClick={() => setMuted(!muted)}
                    className={muted ? 'active' : ''}
                    aria-label="Toggle microphone"
                  >
                    {muted ? <MicOff size={23} /> : <Mic size={23} />}
                  </button>
                  <button
                    onClick={() => setCameraOff(!cameraOff)}
                    className={cameraOff ? 'active' : ''}
                    aria-label="Toggle camera"
                  >
                    {cameraOff ? <CameraOff size={23} /> : <Camera size={23} />}
                  </button>
                  <button
                    className="end-call"
                    onClick={() => {
                      setCompleted(true);
                      go('complete');
                    }}
                    aria-label="End demo call"
                  >
                    <PhoneOff size={23} />
                  </button>
                  <button
                    onClick={() => notify('Call options are demo-only')}
                    aria-label="More options"
                  >
                    <MoreHorizontal size={23} />
                  </button>
                </div>
                <p className="call-disclaimer">
                  Demo experience only · No live video or actual clinician
                </p>
              </div>
            </div>
          )}
          {screen === 'complete' && (
            <div className="complete-page">
              <div className="complete-art">
                <span>
                  <Check size={44} />
                </span>
              </div>
              <span className="eyebrow dark">CONSULTATION ENDED</span>
              <h1>
                You're all
                <br />
                <em>taken care of.</em>
              </h1>
              <p className="muted">
                Your demo consultation is complete. Here's a preview of your
                visit summary.
              </p>
              <div className="summary-card">
                <div className="summary-doctor">
                  <img src={doctor.photo} />
                  <div>
                    <strong>{doctor.name}</strong>
                    <small>General Physician · Demo</small>
                  </div>
                  <CheckCircle2 size={21} />
                </div>
                <div className="divider" />
                <div className="summary-item">
                  <Clock3 size={19} />
                  <span>Call duration</span>
                  <strong>{formatTime(callSeconds)}</strong>
                </div>
                <div className="summary-item">
                  <FileText size={19} />
                  <span>Visit summary</span>
                  <strong>Demo only</strong>
                </div>
                <div className="summary-item">
                  <FileHeart size={19} />
                  <span>Prescription</span>
                  <strong>Not issued</strong>
                </div>
              </div>
              <div className="safety-note">
                <ShieldCheck size={18} />
                <span>
                  Real prescriptions must be issued by a licensed clinician.
                  This demo does not produce medical advice.
                </span>
              </div>
              <button className="primary-button" onClick={() => go('home')}>
                Back to home <ArrowRight size={19} />
              </button>
              <button className="text-button" onClick={() => go('history')}>
                View consultation history
              </button>
            </div>
          )}
          {screen === 'history' && (
            <>
              <SubHeader title="My consultations" />
              <div className="standard-page">
                <h1>
                  Your care,
                  <br />
                  <em>all in one place.</em>
                </h1>
                <p className="muted">
                  A simple view of your previous consultations.
                </p>
                {completed && (
                  <div className="history-card">
                    <span className="history-icon">
                      <Video size={20} />
                    </span>
                    {/* <div>
                      <strong>{doctor.name}</strong>
                      <small>Today · Demo consultation</small>
                      <span className="history-completed">● Completed</span>
                    </div> */}
                    <ChevronRight size={18} />
                  </div>
                )}
                {mock.pastConsultations
                  .filter((c) =>
                    `${c.doctor} ${c.type}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                  )
                  .map((c) => (
                    <div className="history-card" key={c.id}>
                      <span className="history-icon">
                        <FileHeart size={20} />
                      </span>
                      <div>
                        <strong>{c.doctor}</strong>
                        <small>
                          {c.date} · {c.type}
                        </small>
                        <span className="history-completed">
                          ● {c.status} · Sample record
                        </span>
                      </div>
                      <ChevronRight size={18} />
                    </div>
                  ))}
                <p className="sample-note">
                  The records above are fictional demo data from mock.json.
                </p>
              </div>
            </>
          )}
          {screen === 'profile' && (
            <>
              <SubHeader title="My profile" />
              <div className="standard-page">
                <div className="profile-header">
                  <div className="large-avatar">{mock.patient.initials}</div>
                  <h2>{mock.patient.name}</h2>
                  <span>
                    Member since {mock.patient.memberSince} · Demo account
                  </span>
                </div>
                <div className="profile-section-label">YOUR ACCOUNT</div>
                <div className="profile-menu">
                  <button
                    onClick={() =>
                      notify('Demo profile: ' + mock.patient.email)
                    }
                  >
                    <UserRound />
                    Personal information
                    <ChevronRight />
                  </button>
                  <button onClick={() => setCountryOpen(true)}>
                    <Globe2 />
                    Country & region{' '}
                    <small>
                      {country.flag} {country.code}
                    </small>
                    <ChevronRight />
                  </button>
                  <button
                    onClick={() => notify('Language: ' + serviceLanguage)}
                  >
                    <Languages />
                    Language preferences
                    <ChevronRight />
                  </button>
                  <button onClick={() => go('history')}>
                    <History />
                    Consultation history
                    <ChevronRight />
                  </button>
                </div>
                <div className="profile-section-label">OTHER</div>
                <div className="profile-menu">
                  <button
                    onClick={() =>
                      notify('Help center is not connected in demo')
                    }
                  >
                    <Headphones />
                    Help & support
                    <ChevronRight />
                  </button>
                  <button
                    onClick={() =>
                      notify('GoConsult · Frontend demo version 1.0')
                    }
                  >
                    <CircleHelp />
                    About GoConsult
                    <ChevronRight />
                  </button>
                  <button onClick={() => go('doctor')}>
                    <Stethoscope />
                    Preview doctor workspace
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </>
          )}
          {screen === 'doctor' && (
            <>
              <SubHeader title="Doctor workspace" back={() => go('profile')} />
              <div className="doctor-page">
                <div className="doctor-welcome">
                  <div>
                    <span>DOCTOR PORTAL · DEMO</span>
                    <h1>
                      Welcome back,
                      <br />
                      Dr. Sarah 👋
                    </h1>
                  </div>
                  <img src={mock.doctors[0].photo} />
                </div>
                <div className="online-toggle">
                  <div>
                    <strong>Ready to see patients?</strong>
                    <small>
                      {online
                        ? 'You are accepting new requests'
                        : 'You are currently offline'}
                    </small>
                  </div>
                  <button
                    className={'toggle ' + (online ? 'on' : '')}
                    onClick={() => setOnline(!online)}
                    aria-label="Toggle availability"
                  >
                    <span />
                  </button>
                </div>
                <div className="doctor-stats">
                  <div>
                    <Users size={20} />
                    <strong>08</strong>
                    <small>Demo patients</small>
                  </div>
                  <div>
                    <Wallet size={20} />
                    <strong>৳3.2k</strong>
                    <small>Sample earnings</small>
                  </div>
                </div>
                <div className="section-heading">
                  <h3>Consultation requests</h3>
                </div>
                {online ? (
                  <div className="incoming-demo">
                    <div className="incoming-top">
                      <span className="live-dot" /> DEMO REQUEST
                    </div>
                    <h3>New consultation</h3>
                    <p>General care · Patient in Bangladesh</p>
                    <div>
                      <button onClick={() => notify('Request declined (demo)')}>
                        Decline
                      </button>
                      <button
                        onClick={() => notify('Request accepted (demo only)')}
                      >
                        Accept request <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="offline-empty">
                    <Bell size={28} />
                    <strong>You're offline</strong>
                    <p>
                      Switch your availability on to preview incoming requests.
                    </p>
                  </div>
                )}
                <p className="sample-note">
                  All values and incoming requests here are simulated.
                </p>
              </div>
            </>
          )}
          {['home', 'history', 'profile'].includes(screen) && (
            <nav className="bottom-nav">
              <button
                className={tabScreen === 'home' ? 'current' : ''}
                onClick={() => go('home')}
              >
                <Home
                  size={21}
                  strokeWidth={tabScreen === 'home' ? 2.5 : 1.8}
                />
                <span>Home</span>
              </button>
              <button
                className={tabScreen === 'history' ? 'current' : ''}
                onClick={() => go('history')}
              >
                <CalendarDays
                  size={21}
                  strokeWidth={tabScreen === 'history' ? 2.5 : 1.8}
                />
                <span>My visits</span>
              </button>
              <button
                className={tabScreen === 'profile' ? 'current' : ''}
                onClick={() => go('profile')}
              >
                <UserRound
                  size={21}
                  strokeWidth={tabScreen === 'profile' ? 2.5 : 1.8}
                />
                <span>Profile</span>
              </button>
            </nav>
          )}
          {countryOpen && (
            <div
              className="modal-backdrop"
              onClick={() => setCountryOpen(false)}
            >
              <div
                className="country-sheet"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sheet-grip" />
                <div className="sheet-heading">
                  <div>
                    <span className="eyebrow dark">YOUR LOCATION</span>
                    <h2>Choose your country</h2>
                    <p>We’ll tailor your care experience to your region.</p>
                  </div>
                  <button
                    onClick={() => setCountryOpen(false)}
                    aria-label="Close"
                  >
                    <X size={22} />
                  </button>
                </div>
                {mock.countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCountry(c);
                      setCountryOpen(false);
                    }}
                    className={
                      'country-choice ' +
                      (c.code === country.code ? 'chosen' : '')
                    }
                  >
                    <span>{c.flag}</span>
                    <div>
                      <strong>{c.name}</strong>
                      <small>{c.language}</small>
                    </div>
                    {c.code === country.code ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>
                ))}
                <p className="sheet-footnote">
                  Demo regions only. Actual doctor eligibility requires
                  jurisdiction verification.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
function SubHeader({ title, back }: { title: string; back?: () => void }) {
  return (
    <header className="sub-header">
      <button
        onClick={back || (() => window.location.assign('/'))}
        aria-label="Back"
      >
        <ArrowLeft size={21} />
      </button>
      <strong>{title}</strong>
      <span className="sub-header-spacer" />
    </header>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
