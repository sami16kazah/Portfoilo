"use client";

import React, { useState } from 'react';
import {
  Check,
  Copy,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa';
import {
  PORTFOLIO_COPY,
  getLocalizedText,
  resolveAssetUrl,
  type Locale,
  type ProfileData,
  type SiteSettingsData,
} from './portfolioCopy';
import { SectionHeader } from './SectionHeader';

interface ContactSectionProps {
  locale: Locale;
  profile: ProfileData;
  siteSettings?: SiteSettingsData;
  apiEndpoint?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  locale,
  profile,
  siteSettings,
  apiEndpoint,
}) => {
  const copy = PORTFOLIO_COPY[locale];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const contactEmail = profile.email || 'samkazah444@gmail.com';
  const serviceOptions =
    siteSettings?.serviceOptions && siteSettings.serviceOptions.length > 0
      ? siteSettings.serviceOptions
      : ['Full-Stack Web', 'Cloud / ERP', 'UI/UX & Frontend', 'API & Backend'];
  const budgetOptions =
    siteSettings?.budgetOptions && siteSettings.budgetOptions.length > 0
      ? siteSettings.budgetOptions
      : ['< €1,000', '€1,000 – €5,000', '€5,000+', 'Full-Time / Role'];

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((x) => x !== topic) : [...prev, topic]
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    if (!apiEndpoint) {
      window.setTimeout(() => {
        setFeedback({ type: 'success', text: copy.contact.sentSuccess });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setSelectedTopics([]);
        setSelectedBudget('');
        setSubmitting(false);
      }, 350);
      return;
    }

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          service: selectedTopics.join(', '),
          budget: selectedBudget,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setFeedback({ type: 'success', text: copy.contact.sentSuccess });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setSelectedTopics([]);
        setSelectedBudget('');
      } else {
        setFeedback({
          type: 'error',
          text: data.message || 'Could not send right now. Please email directly.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        text: 'Network error. Please use the direct email link instead.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const avatarSrc = resolveAssetUrl(profile.avatarUrl || '/assets/images/sami.jpg');
  const displayName = getLocalizedText(profile, 'name', locale, 'Sami Kazah');
  const displayTitle = getLocalizedText(profile, 'title', locale, 'Software & Full-Stack Engineer');

  return (
    <section id="contact" className="sk-section sk-section-alt">
      <div className="sk-container">
        <SectionHeader
          code={copy.sections.contact.code}
          label={copy.sections.contact.label}
          meta={copy.sections.contact.meta}
        />

        <div className="sk-contact-grid">
          {/* Left Info Column */}
          <div className="sk-contact-info">
            <h2 className="sk-display-h2">
              {copy.contact.heading}{' '}
              <span className="sk-brand-highlight">{copy.contact.headingAccent}</span>
            </h2>
            <p className="sk-lead">{copy.contact.subtitle}</p>

            <div className="sk-contact-card">
              <div className="sk-contact-person">
                <img src={avatarSrc} alt={displayName} className="sk-contact-avatar" />
                <div>
                  <strong>{displayName}</strong>
                  <span>{displayTitle}</span>
                  <small>
                    <MapPin size={12} /> {copy.contact.locationLabel}
                  </small>
                </div>
              </div>

              <div className="sk-contact-email-box">
                <span className="sk-micro-label">DIRECT EMAIL</span>
                <strong className="sk-contact-email-val">{contactEmail}</strong>
                <div className="sk-contact-email-btns">
                  <a href={`mailto:${contactEmail}`} className="sk-btn sk-btn-primary sk-btn-sm">
                    <Mail size={14} />
                    <span>{copy.contact.directEmail}</span>
                  </a>
                  <button
                    type="button"
                    className="sk-btn sk-btn-outline sk-btn-sm"
                    onClick={handleCopy}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? copy.contact.copied : copy.contact.copyEmail}</span>
                  </button>
                </div>
              </div>

              <div className="sk-contact-socials">
                {profile.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sk-btn sk-btn-outline sk-btn-sm"
                  >
                    <Github size={14} />
                    <span>GITHUB</span>
                  </a>
                )}
                {profile.socialLinks?.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sk-btn sk-btn-outline sk-btn-sm"
                  >
                    <Linkedin size={14} />
                    <span>LINKEDIN</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <form className="sk-contact-form" onSubmit={handleSubmit}>
            <div className="sk-form-row">
              <label className="sk-field">
                <span>{copy.contact.name}</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={copy.contact.namePlaceholder}
                />
              </label>

              <label className="sk-field">
                <span>{copy.contact.email}</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
              </label>
            </div>

            <label className="sk-field">
              <span>{copy.contact.subject}</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={copy.contact.subjectPlaceholder}
              />
            </label>

            <div className="sk-field">
              <span>{copy.contact.servicesLabel}</span>
              <div className="sk-chip-select-row">
                {serviceOptions.map((srv) => {
                  const active = selectedTopics.includes(srv);
                  return (
                    <button
                      key={srv}
                      type="button"
                      className={`sk-select-chip ${active ? 'is-active' : ''}`}
                      onClick={() => toggleTopic(srv)}
                    >
                      {srv}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sk-field">
              <span>{copy.contact.budgetLabel}</span>
              <div className="sk-chip-select-row">
                {budgetOptions.map((opt) => {
                  const active = selectedBudget === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`sk-select-chip is-scope ${active ? 'is-active' : ''}`}
                      onClick={() => setSelectedBudget(active ? '' : opt)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="sk-field">
              <span>{copy.contact.message}</span>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={copy.contact.messagePlaceholder}
              />
            </label>

            {feedback && (
              <div className={`sk-form-feedback is-${feedback.type}`} role="status">
                {feedback.text}
              </div>
            )}

            <button type="submit" disabled={submitting} className="sk-btn sk-btn-primary">
              <Send size={14} />
              <span>{submitting ? copy.contact.sending : copy.contact.send}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
