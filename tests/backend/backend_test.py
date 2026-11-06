#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for METECHQ Admin Panel
Tests all CRUD operations for admin panel functionality
"""

import os
import requests
import sys
import json
from datetime import datetime
import uuid

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

class MSPNAdminAPITester:
    def __init__(self, base_url="http://localhost:8001/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.session = requests.Session()
        
    def log_result(self, test_name, success, response_data=None, error=None):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name} - PASSED")
        else:
            self.failed_tests.append({
                "test": test_name,
                "error": error,
                "response": response_data
            })
            print(f"❌ {test_name} - FAILED: {error}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=test_headers)

            success = (response.status_code == expected_status) or (expected_status in (200, 201) and response.status_code in (200, 201))
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"text": response.text}

            if success:
                self.log_result(name, True, response_data)
                return True, response_data
            else:
                error = f"Expected {expected_status}, got {response.status_code}"
                self.log_result(name, False, response_data, error)
                return False, response_data

        except Exception as e:
            error = f"Request failed: {str(e)}"
            self.log_result(name, False, {}, error)
            return False, {}

    def test_health_check(self):
        """Test API health check"""
        return self.run_test("API Health Check", "GET", "/", 200)

    def test_admin_login(self):
        """Test admin login and get JWT token"""
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "/admins/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            print(f"   🔑 Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_dashboard_stats(self):
        """Test dashboard statistics"""
        return self.run_test("Dashboard Stats", "GET", "/analytics/summary", 200)

    def test_about_management(self):
        """Test About page CRUD operations"""
        print("\n📝 Testing About Management...")
        
        # Get about content
        success, about_data = self.run_test("Get About Content", "GET", "/about", 200)
        
        if success and isinstance(about_data, dict):
            # Update about content
            updated_content = dict(about_data)
            updated_content["hero_title"] = "Updated About Title"
            updated_content.pop("id", None)
            updated_content.pop("_id", None)
            updated_content.pop("updated_at", None)
            
            self.run_test("Update About Content", "PUT", "/about", 200, data=updated_content)

    def test_services_management(self):
        """Test Services CRUD operations"""
        print("\n🛠️ Testing Services Management...")
        
        # Get all services
        success, services = self.run_test("Get All Services", "GET", "/services", 200)
        
        # Create new service
        new_service = {
            "title": "Test Service",
            "description": "Test service description",
            "price": "$999",
            "icon": "Code",
            "features": ["Feature 1", "Feature 2"],
            "active": True
        }
        
        success, created_service = self.run_test("Create Service", "POST", "/services", 201, data=new_service)
        
        if success and 'id' in created_service:
            service_id = created_service['id']
            
            # Update service
            updated_service = {
                "title": "Updated Test Service",
                "description": "Updated description",
                "price": "$1299"
            }
            
            self.run_test(f"Update Service", "PUT", f"/services/{service_id}", 200, data=updated_service)
            
            # Delete service
            self.run_test(f"Delete Service", "DELETE", f"/services/{service_id}", 200)

    def test_portfolio_management(self):
        """Test Portfolio CRUD operations"""
        print("\n💼 Testing Portfolio Management...")
        
        # Get all projects
        success, projects = self.run_test("Get All Projects", "GET", "/projects", 200)
        
        # Create new project
        new_project = {
            "title": "Test Portfolio Project",
            "description": "Test project description",
            "category": "web-app",
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
            "tech_stack": ["React", "Node.js"],
            "status": "completed",
            "client_name": "Test Client"
        }
        
        success, created_project = self.run_test("Create Project", "POST", "/projects", 201, data=new_project)
        
        if success and 'id' in created_project:
            project_id = created_project['id']
            
            # Update project
            updated_project = {
                "title": "Updated Test Project",
                "description": "Updated description"
            }
            
            self.run_test(f"Update Project", "PUT", f"/projects/{project_id}", 200, data=updated_project)
            
            # Delete project
            self.run_test(f"Delete Project", "DELETE", f"/projects/{project_id}", 200)

    def test_blogs_management(self):
        """Test Blogs CRUD operations"""
        print("\n📰 Testing Blogs Management...")
        
        # Get all blogs (admin)
        success, blogs = self.run_test("Get All Blogs", "GET", "/blogs/admin/all", 200)
        
        # Create new blog
        new_blog = {
            "title": f"Test Blog Post {uuid.uuid4().hex[:6]}",
            "content": "Test blog content",
            "excerpt": "Test excerpt",
            "cover_image": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
            "author": "Admin",
            "category": "technology",
            "tags": ["test", "api"],
            "status": "draft"
        }
        
        success, created_blog = self.run_test("Create Blog", "POST", "/blogs/admin/create", 200, data=new_blog)
        
        if success and 'id' in created_blog:
            blog_id = created_blog['id']
            
            # Update blog
            updated_blog = {
                "title": "Updated Test Blog",
                "content": "Updated content"
            }
            
            self.run_test(f"Update Blog", "PUT", f"/blogs/admin/{blog_id}", 200, data=updated_blog)
            
            # Delete blog
            self.run_test(f"Delete Blog", "DELETE", f"/blogs/admin/{blog_id}", 200)

    def test_testimonials_management(self):
        """Test Testimonials CRUD operations"""
        print("\n💬 Testing Testimonials Management...")
        
        # Get all testimonials (admin)
        success, testimonials = self.run_test("Get All Testimonials", "GET", "/testimonials/admin/all", 200)
        
        # Create new testimonial
        new_testimonial = {
            "name": "Test Client",
            "company": "Test Company",
            "message": "Great service!",
            "rating": 5,
            "status": "approved",
            "source": "admin_created",
            "verified": True
        }
        
        success, created_testimonial = self.run_test("Create Testimonial", "POST", "/testimonials/admin/create", 201, data=new_testimonial)
        
        if success and 'id' in created_testimonial:
            testimonial_id = created_testimonial['id']
            
            # Update testimonial
            updated_testimonial = {
                "message": "Updated testimonial message",
                "rating": 4
            }
            
            self.run_test(f"Update Testimonial", "PUT", f"/testimonials/admin/{testimonial_id}", 200, data=updated_testimonial)
            
            # Delete testimonial
            self.run_test(f"Delete Testimonial", "DELETE", f"/testimonials/admin/{testimonial_id}", 200)

    def test_contacts_management(self):
        """Test Contacts management"""
        print("\n📧 Testing Contacts Management...")
        
        # Get all contacts (admin)
        self.run_test("Get All Contacts", "GET", "/contacts/admin/all", 200)

    def test_skills_management(self):
        """Test Skills CRUD operations"""
        print("\n🎯 Testing Skills Management...")
        
        # Get all skills
        success, skills = self.run_test("Get All Skills", "GET", "/skills", 200)
        
        # Create new skill
        new_skill = {
            "name": "Test Skill",
            "icon": "Code"
        }
        
        success, created_skill = self.run_test("Create Skill", "POST", "/skills", 201, data=new_skill)
        
        if success and 'id' in created_skill:
            skill_id = created_skill['id']
            
            # Update skill
            updated_skill = {
                "name": "Updated Test Skill",
                "icon": "Star"
            }
            
            self.run_test(f"Update Skill", "PUT", f"/skills/{skill_id}", 200, data=updated_skill)
            
            # Delete skill
            self.run_test(f"Delete Skill", "DELETE", f"/skills/{skill_id}", 200)

    def test_notes_management(self):
        """Test Notes CRUD operations"""
        print("\n📝 Testing Notes Management...")
        
        # Get all notes
        success, notes = self.run_test("Get All Notes", "GET", "/notes", 200)
        
        # Create new note
        new_note = {
            "name": "Test Note",
            "content": "Test note content",
            "tags": ["test"]
        }
        
        success, created_note = self.run_test("Create Note", "POST", "/notes", 201, data=new_note)
        
        if success and 'id' in created_note:
            note_id = created_note['id']
            
            # Update note
            updated_note = {
                "name": "Updated Test Note",
                "content": "Updated note content"
            }
            
            self.run_test(f"Update Note", "PUT", f"/notes/{note_id}", 200, data=updated_note)
            
            # Delete note
            self.run_test(f"Delete Note", "DELETE", f"/notes/{note_id}", 200)

    def test_admins_management(self):
        """Test Admin users management"""
        print("\n👥 Testing Admins Management...")
        
        # Get all admins
        self.run_test("Get All Admins", "GET", "/admins/list", 200)

    def test_settings_management(self):
        """Test Settings management"""
        print("\n⚙️ Testing Settings Management...")
        
        # Get settings
        success, settings = self.run_test("Get Settings", "GET", "/settings", 200)
        
        if success:
            # Update settings
            updated_settings = {
                "site_name": "Updated METECHQ",
                "site_description": "Updated description"
            }
            
            self.run_test("Update Settings", "PUT", "/settings", 200, data=updated_settings)

    def test_booking_management(self):
        """Test Booking related operations"""
        print("\n📅 Testing Booking Management...")
        
        # Get booking settings
        self.run_test("Get Booking Settings", "GET", "/booking-settings", 200)
        
        # Get bookings (admin)
        self.run_test("Get All Bookings", "GET", "/bookings/admin/all", 200)

    def test_client_management(self):
        """Test Client management"""
        print("\n👤 Testing Client Management...")
        
        # Get all clients
        success, clients = self.run_test("Get All Clients", "GET", "/admin/clients", 200)
        
        # Get client projects
        self.run_test("Get Client Projects", "GET", "/admin/client-projects", 200)

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting METECHQ Admin Panel API Tests")
        print("=" * 60)
        
        # Health check
        if not self.test_health_check()[0]:
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Authentication
        if not self.test_admin_login():
            print("❌ Authentication failed. Stopping tests.")
            return False
        
        # Run all management tests
        self.test_dashboard_stats()
        self.test_about_management()
        self.test_services_management()
        self.test_portfolio_management()
        self.test_blogs_management()
        self.test_testimonials_management()
        self.test_contacts_management()
        self.test_skills_management()
        self.test_notes_management()
        self.test_admins_management()
        self.test_settings_management()
        self.test_booking_management()
        self.test_client_management()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"   • {test['test']}: {test['error']}")
        
        return len(self.failed_tests) == 0

def main():
    """Main test execution"""
    tester = MSPNAdminAPITester()
    success = tester.run_all_tests()
    
    # Save results for reporting
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "failed_tests": len(tester.failed_tests),
        "success_rate": (tester.tests_passed/tester.tests_run)*100 if tester.tests_run > 0 else 0,
        "failed_test_details": tester.failed_tests
    }
    
    results_path = os.path.join(os.path.dirname(__file__), 'backend_test_results.json')
    with open(results_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())