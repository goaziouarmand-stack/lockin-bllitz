import MatchForm from '../components/admin/MatchForm'

export default function Admin() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-5xl font-bold text-purple-400 mb-10">
        Admin Panel
      </h1>

      <MatchForm />
    </div>
  )
}