export default function Services() {
  const services = [
    {
      title: 'Web Development',
      description: 'Full stack web applications built with modern technologies.',
    },
    {
      title: 'API Development',
      description: 'Scalable and secure REST APIs for your applications.',
    },
    {
      title: 'UI/UX Design',
      description: 'Beautiful, responsive user interfaces that engage users.',
    },
  ];

  return (
    <section id="services" className="py-24">
      <h2 className="text-center mb-16 text-white">Services</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div key={service.title} className="card p-8 text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
            <p className="text-slate-400">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
