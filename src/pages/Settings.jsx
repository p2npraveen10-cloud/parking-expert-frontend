import { useState } from "react";
import {
  User,
  ShieldCheck,
  Bell,
  Building2,
  SlidersHorizontal,
  Camera,
  Smartphone,
  Mail,
  Globe,
} from "lucide-react";

// ---------- small building blocks ----------

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
          checked ? "bg-indigo-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function Field({ label, description, children }) {
  return (
    <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
      <div>
        <label className="text-sm font-medium text-slate-900">{label}</label>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        )}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
    />
  );
}

function Select({ options, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Card({ title, description, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        )}
      </div>
      <div className="divide-y divide-slate-100 px-6">{children}</div>
    </div>
  );
}

function PageHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function SaveBar() {
  return (
    <div className="mt-8 flex justify-end gap-3">
      <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
        Cancel
      </button>
      <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
        Save changes
      </button>
    </div>
  );
}

// ---------- tab panels ----------

function GeneralPanel() {
  return (
    <>
      <PageHeader
        title="General"
        description="Your personal information and how it appears across the project."
      />
      <Card title="Profile">
        <div className="flex items-center gap-4 py-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
              AK
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-indigo-600">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Profile photo</p>
            <p className="text-sm text-slate-500">JPG or PNG, up to 2MB.</p>
          </div>
        </div>
        <Field label="Full name">
          <TextInput defaultValue="Anaya Kapoor" />
        </Field>
        <Field label="Email address" description="Used for sign-in and notifications.">
          <TextInput defaultValue="anaya@company.com" type="email" />
        </Field>
        <Field label="Time zone">
          <Select
            defaultValue="Asia/Kolkata (GMT+5:30)"
            options={["Asia/Kolkata (GMT+5:30)", "UTC", "America/New_York"]}
          />
        </Field>
      </Card>
      <SaveBar />
    </>
  );
}

function SecurityPanel() {
  const [twoFA, setTwoFA] = useState(true);
  const [alerts, setAlerts] = useState(false);

  return (
    <>
      <PageHeader
        title="Security"
        description="Manage how you sign in and keep your account protected."
      />
      <Card title="Password">
        <Field label="Change password" description="Last updated 3 months ago.">
          <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Update password
          </button>
        </Field>
      </Card>
      <div className="h-6" />
      <Card title="Two-factor authentication">
        <Toggle
          checked={twoFA}
          onChange={setTwoFA}
          label="Require a code at sign-in"
          description="Adds an extra step using your authenticator app."
        />
        <Toggle
          checked={alerts}
          onChange={setAlerts}
          label="Alert me on new device sign-in"
          description="Get an email whenever your account is accessed from a new device."
        />
      </Card>
      <div className="h-6" />
      <Card title="Active sessions">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-900">
                Chrome on macOS — this device
              </p>
              <p className="text-sm text-slate-500">Gujarat, India · Active now</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            Current
          </span>
        </div>
      </Card>
      <SaveBar />
    </>
  );
}

function NotificationsPanel() {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [digest, setDigest] = useState(false);

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Choose what you hear about, and where."
      />
      <Card title="Email">
        <Toggle
          checked={email}
          onChange={setEmail}
          label="Project updates"
          description="Task assignments, status changes, and due dates."
        />
        <Toggle
          checked={digest}
          onChange={setDigest}
          label="Weekly digest"
          description="A Monday summary of activity across your projects."
        />
      </Card>
      <div className="h-6" />
      <Card title="Push">
        <Toggle
          checked={push}
          onChange={setPush}
          label="Push notifications"
          description="Real-time alerts on desktop and mobile."
        />
        <Toggle
          checked={mentions}
          onChange={setMentions}
          label="@Mentions"
          description="Notify me when someone mentions me in a comment."
        />
      </Card>
      <SaveBar />
    </>
  );
}

function CompanyPanel() {
  return (
    <>
      <PageHeader
        title="Company"
        description="Details about your organization visible to your team."
      />
      <Card title="Organization">
        <Field label="Company name">
          <TextInput defaultValue="Northwind Studio" />
        </Field>
        <Field label="Website">
          <TextInput defaultValue="https://northwind.studio" />
        </Field>
        <Field label="Industry">
          <Select
            defaultValue="Software"
            options={["Software", "Design", "Marketing", "Finance"]}
          />
        </Field>
      </Card>
      <div className="h-6" />
      <Card title="Billing address">
        <Field label="Address">
          <TextInput defaultValue="4th Floor, Sunrise Business Park, Gujarat" />
        </Field>
      </Card>
      <SaveBar />
    </>
  );
}

function PreferencesPanel() {
  const [compact, setCompact] = useState(false);

  return (
    <>
      <PageHeader
        title="Preferences"
        description="Tune how the workspace looks and behaves for you."
      />
      <Card title="Appearance">
        <Field label="Theme">
          <Select defaultValue="System" options={["System", "Light", "Dark"]} />
        </Field>
        <Toggle
          checked={compact}
          onChange={setCompact}
          label="Compact density"
          description="Show more rows on screen with tighter spacing."
        />
      </Card>
      <div className="h-6" />
      <Card title="Language & region">
        <Field label="Language">
          <Select defaultValue="English" options={["English", "Hindi", "Gujarati"]} />
        </Field>
      </Card>
      <SaveBar />
    </>
  );
}

// ---------- sidebar shell ----------

const TABS = [
  { id: "general", label: "General", icon: User, panel: GeneralPanel },
  { id: "security", label: "Security", icon: ShieldCheck, panel: SecurityPanel },
  { id: "notifications", label: "Notifications", icon: Bell, panel: NotificationsPanel },
  { id: "company", label: "Company", icon: Building2, panel: CompanyPanel },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal, panel: PreferencesPanel },
];

export default function SettingsTab() {
  const [active, setActive] = useState("general");
  const ActivePanel = TABS.find((t) => t.id === active).panel;

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white px-3 py-6">
        <div className="mb-6 px-3">
          <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">Manage your project</p>
        </div>
        <nav className="flex flex-col gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 ${
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"
                  }`}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-2xl">
          <ActivePanel />
        </div>
      </main>
    </div>
  );
}