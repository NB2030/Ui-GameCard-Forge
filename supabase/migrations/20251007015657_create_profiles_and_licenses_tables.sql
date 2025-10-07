/*
  # إنشاء جداول الملفات الشخصية والتراخيص
  
  1. جدول profiles
    - يخزن معلومات الملف الشخصي للمستخدم
    - `id` (uuid, مفتاح أساسي) - معرف المستخدم من auth.users
    - `email` (text) - البريد الإلكتروني
    - `full_name` (text) - الاسم الكامل
    - `created_at` (timestamptz) - تاريخ الإنشاء
    - `updated_at` (timestamptz) - تاريخ آخر تحديث
    
  2. جدول user_licenses
    - يخزن معلومات التراخيص
    - `uuid` (uuid, مفتاح أساسي)
    - `user_id` (uuid, مفتاح خارجي) - معرف المستخدم
    - `license_id` (uuid) - معرف الترخيص
    - `license_key` (text) - مفتاح الترخيص
    - `activated_at` (timestamptz) - تاريخ التفعيل
    - `expires_at` (timestamptz) - تاريخ الانتهاء
    - `is_active` (bool) - حالة التفعيل
    - `last_validated` (timestamptz) - آخر تحقق
    
  3. الأمان
    - تفعيل RLS على كلا الجدولين
    - السماح للمستخدمين بقراءة بياناتهم فقط
*/

-- إنشاء جدول profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- تفعيل RLS على profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- سياسات RLS لجدول profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- إنشاء جدول user_licenses
CREATE TABLE IF NOT EXISTS user_licenses (
  uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  license_id uuid NOT NULL,
  license_key text NOT NULL,
  activated_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  last_validated timestamptz DEFAULT now()
);

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS user_licenses_user_id_idx ON user_licenses(user_id);
CREATE INDEX IF NOT EXISTS user_licenses_license_key_idx ON user_licenses(license_key);

-- تفعيل RLS على user_licenses
ALTER TABLE user_licenses ENABLE ROW LEVEL SECURITY;

-- سياسات RLS لجدول user_licenses
CREATE POLICY "Users can read own licenses"
  ON user_licenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- وظيفة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء trigger لتحديث updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- وظيفة لإنشاء profile تلقائياً عند تسجيل مستخدم جديد
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء trigger لإنشاء profile تلقائياً
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_new_user();