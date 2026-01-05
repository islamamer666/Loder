-- Add new categories to existing database
INSERT INTO categories (name, name_ar, icon) VALUES
    ('Forklifts', 'رافعات شوكية', 'forklift'),
    ('Pick & Carry', 'رافعات محمولة', 'pick-carry'),
    ('Boom Lifts', 'رافعات بوم', 'boom-lift'),
    ('Scissor Lifts', 'رافعات مقصية', 'scissor-lift'),
    ('Tractors', 'جرارات', 'tractor'),
    ('Backhoes', 'حفارات خلفية', 'backhoe'),
    ('Trucks', 'شاحنات', 'truck'),
    ('Asphalt Compaction Double Drum', 'مدكوكات أسفلت مزدوجة', 'asphalt-compactor')
ON CONFLICT (name) DO NOTHING;

