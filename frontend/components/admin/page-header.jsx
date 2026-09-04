export function AdminPageHeader({ title, description, actions, className }) {
  return (
    <div className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className || ''}`}>
      <div>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-navy md:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm font-medium text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
