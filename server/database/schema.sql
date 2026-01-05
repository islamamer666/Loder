-- Create database (run this manually in PostgreSQL)
-- CREATE DATABASE loder;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    name_ar VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Equipment listings table
CREATE TABLE IF NOT EXISTS equipment (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    location VARCHAR(200) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    owner_email VARCHAR(100) NOT NULL,
    owner_phone VARCHAR(20),
    images JSONB DEFAULT '[]'::jsonb,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, name_ar, icon) VALUES
    ('Excavators', 'حفارات', 'excavator'),
    ('Bulldozers', 'جرافات', 'bulldozer'),
    ('Cranes', 'رافعات', 'crane'),
    ('Loaders', 'لوادر', 'loader'),
    ('Dump Trucks', 'شاحنات قلابة', 'truck'),
    ('Compactors', 'مدكوكات', 'compactor'),
    ('Concrete Mixers', 'خلاطات خرسانة', 'mixer'),
    ('Generators', 'مولدات', 'generator'),
    ('Scaffolding', 'سقالات', 'scaffolding'),
    ('Forklifts', 'رافعات شوكية', 'forklift'),
    ('Pick & Carry', 'رافعات محمولة', 'pick-carry'),
    ('Boom Lifts', 'رافعات بوم', 'boom-lift'),
    ('Scissor Lifts', 'رافعات مقصية', 'scissor-lift'),
    ('Tractors', 'جرارات', 'tractor'),
    ('Backhoes', 'حفارات خلفية', 'backhoe'),
    ('Trucks', 'شاحنات', 'truck'),
    ('Asphalt Compaction Double Drum', 'مدكوكات أسفلت مزدوجة', 'asphalt-compactor'),
    ('Other', 'أخرى', 'other')
ON CONFLICT (name) DO NOTHING;

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(location);
CREATE INDEX IF NOT EXISTS idx_equipment_available ON equipment(is_available);

