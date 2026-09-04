'use client';

import { useId, useRef, useState } from 'react';

import { validate, type Intent, type Place, type RequestResult } from '@/lib/appointments';
import { appointmentsPage, contactPage } from '@/lib/content/pages';
import { track } from '@/lib/analytics';
import styles from './RequestForm.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'failed' | 'unavailable';

/**
 * One form serves both the appointment request and the inquiry. They ask for
 * almost the same things and go to the same place, so making two of them would
 * be two things to keep in step rather than one.
 *
 * The form is switched off, visibly, when no destination is configured. It does
 * not collect anything it cannot deliver, and it never shows a confirmation for
 * a request the server did not accept.
 */
export function RequestForm({
  intent,
  deliveryConfigured,
}: {
  intent: Intent;
  deliveryConfigured: boolean;
}) {
  const uid = useId();
  const copy = appointmentsPage.form;
  const [status, setStatus] = useState<Status>(deliveryConfigured ? 'idle' : 'unavailable');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const outcomeRef = useRef<HTMLDivElement>(null);

  const disabled = !deliveryConfigured || status === 'sending';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!deliveryConfigured) return;

    const data = new FormData(event.currentTarget);
    const payload = {
      intent,
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      telephone: String(data.get('telephone') ?? ''),
      place: (data.get('place') as Place | null) ?? undefined,
      about: String(data.get('about') ?? ''),
      timing: String(data.get('timing') ?? ''),
      company: String(data.get('company') ?? ''),
    };

    const clientErrors = validate(payload);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      const first = document.getElementById(`${uid}-${Object.keys(clientErrors)[0]}`);
      first?.focus();
      return;
    }

    setFieldErrors({});
    setStatus('sending');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as RequestResult;

      if (result.ok) {
        setStatus('sent');
        // Fired once, on a confirmed acceptance by the server.
        track(intent === 'appointment' ? 'appointment_request_sent' : 'inquiry_sent');
      } else if (result.reason === 'invalid') {
        setFieldErrors(result.fields);
        setStatus('idle');
      } else if (result.reason === 'unavailable') {
        setStatus('unavailable');
      } else {
        setStatus('failed');
      }
    } catch {
      setStatus('failed');
    }

    requestAnimationFrame(() => outcomeRef.current?.focus());
  }

  if (status === 'sent') {
    const success = intent === 'appointment' ? copy.success : contactPage.form.success;
    return (
      <div className={styles.outcome} ref={outcomeRef} tabIndex={-1} role="status">
        <span className={styles.outcomeTitle}>{success.title}</span>
        <p className={styles.outcomeBody}>{success.body}</p>
      </div>
    );
  }

  return (
    <div>
      {!deliveryConfigured ? (
        <div className={styles.notice} role="note">
          <span className="annotation" style={{ color: 'var(--madder)' }}>
            Not connected
          </span>
          <span className={styles.outcomeTitle}>{copy.unavailable.title}</span>
          <p className={styles.outcomeBody}>{copy.unavailable.body}</p>
        </div>
      ) : null}

      <form
        className={`${styles.form} ${disabled && !deliveryConfigured ? styles.disabled : ''}`}
        onSubmit={handleSubmit}
        noValidate
      >
        <Field
          uid={uid}
          name="name"
          label={copy.nameLabel}
          autoComplete="name"
          required
          error={fieldErrors.name}
          disabled={disabled}
        />
        <Field
          uid={uid}
          name="email"
          type="email"
          label={copy.emailLabel}
          autoComplete="email"
          inputMode="email"
          required
          error={fieldErrors.email}
          disabled={disabled}
        />
        <Field
          uid={uid}
          name="telephone"
          type="tel"
          label={copy.telephoneLabel}
          hint={copy.telephoneHint}
          autoComplete="tel"
          inputMode="tel"
          error={fieldErrors.telephone}
          disabled={disabled}
        />

        {intent === 'appointment' ? (
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className={styles.label}>{copy.placeLabel}</legend>
            <div className={styles.choices}>
              {copy.places.map((place) => (
                <label key={place.value} className={styles.choice}>
                  <input
                    className={styles.radio}
                    type="radio"
                    name="place"
                    value={place.value}
                    defaultChecked={place.value === 'studio'}
                    disabled={disabled}
                  />
                  {place.label}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        <Field
          uid={uid}
          name="about"
          label={intent === 'appointment' ? copy.aboutLabel : contactPage.form.aboutLabel}
          hint={intent === 'appointment' ? copy.aboutHint : contactPage.form.aboutHint}
          multiline
          required={intent === 'inquiry'}
          error={fieldErrors.about}
          disabled={disabled}
        />

        {intent === 'appointment' ? (
          <Field
            uid={uid}
            name="timing"
            label={copy.timingLabel}
            hint={copy.timingHint}
            error={fieldErrors.timing}
            disabled={disabled}
          />
        ) : null}

        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor={`${uid}-company`}>Company</label>
          <input id={`${uid}-company`} name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <div className={styles.foot}>
          <p className={styles.privacy}>{copy.privacy}</p>
          <button
            type="submit"
            className={styles.submit}
            disabled={disabled}
            data-cta="request-submit"
          >
            {status === 'sending'
              ? copy.submitting
              : intent === 'appointment'
                ? copy.submit
                : contactPage.form.submit}
          </button>
        </div>

        {status === 'failed' ? (
          <div
            className={`${styles.outcome} ${styles.outcomeFailed}`}
            ref={outcomeRef}
            tabIndex={-1}
            role="alert"
          >
            <span className={styles.outcomeTitle}>{copy.failure.title}</span>
            <p className={styles.outcomeBody}>{copy.failure.body}</p>
          </div>
        ) : null}
      </form>
    </div>
  );
}

function Field({
  uid,
  name,
  label,
  hint,
  type = 'text',
  multiline = false,
  required = false,
  error,
  disabled,
  autoComplete,
  inputMode,
}: {
  uid: string;
  name: string;
  label: string;
  hint?: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  error?: string | undefined;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: 'email' | 'tel' | 'text';
}) {
  const id = `${uid}-${name}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const shared = {
    id,
    name,
    required,
    disabled,
    autoComplete,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': describedBy,
    className: multiline ? styles.textarea : styles.input,
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {required ? <span className="visually-hidden"> (required)</span> : null}
      </label>
      {hint ? (
        <span className={styles.hint} id={hintId}>
          {hint}
        </span>
      ) : null}
      {multiline ? (
        <textarea {...shared} rows={4} />
      ) : (
        <input {...shared} type={type} inputMode={inputMode} />
      )}
      {error ? (
        <span className={styles.error} id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
