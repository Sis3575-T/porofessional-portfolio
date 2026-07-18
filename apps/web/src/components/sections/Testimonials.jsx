export default function Testimonials() {
  const testimonials = [
    {
      name: 'John Doe',
      role: 'CEO',
      company: 'Tech Company',
      text: 'Excellent developer, delivered on time and exceeded expectations.',
    },
  ];

  return (
    <section id="testimonials" className="py-24">
      <h2 className="text-center mb-16 text-white">Testimonials</h2>
      <div className="max-w-2xl mx-auto">
        {testimonials.map((testimonial) => (
          <div key={testimonial.name} className="card p-8">
            <p className="text-slate-300 mb-4 italic">"{testimonial.text}"</p>
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-slate-400 text-sm">{testimonial.role} at {testimonial.company}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
