const LoginLeftSide = () => {
  return (
    <div className="hidden md:flex md:w-1/2 min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute -top-30 -left-30 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-start justify-center p-12 lg:p-20 w-full h-full">
        <h1 className="text-4xl lg:text-5xl font-medium text-white mb-6 leading-tight tracking-tight">
          Employee
          <br />
          Management System
        </h1>

        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
          Streamline your workforce operations, track attendance, manage
          payroll, and empower your team securely.
        </p>
      </div>
    </div>
  );
};

export default LoginLeftSide;