export default function ChangePasswordGoogleNotice() {
  return (
    <div className="p-3.5 rounded-2xl bg-[#E7F3EC]/70 border border-[#D8E6DE] text-[#369D6D] text-xs leading-relaxed flex items-start gap-2.5">
      <svg className="w-4 h-4 shrink-0 text-[#369D6D] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        Akun Anda saat ini masuk dengan Google. Anda dapat membuat kata sandi baru agar dapat masuk secara manual dengan email &amp; kata sandi.
      </span>
    </div>
  );
}
