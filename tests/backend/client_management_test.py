#!/usr/bin/env python3
"""
Client Management and Project Assignment Backend API Testing
Tests the specific functionality mentioned in the review request
"""

import os
import requests
import sys
import json
from datetime import datetime, date, timedelta
import uuid

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

class ClientManagementTester:
    def __init__(self, base_url=None):
        self.base_url = base_url or os.environ.get("BACKEND_URL", "http://127.0.0.1:8002/api")
        self.admin_token = None
        self.client_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.created_client_id = None
        self.created_project_id = None
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

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, use_admin_token=True):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        test_headers = {'Content-Type': 'application/json'}
        
        if use_admin_token and self.admin_token:
            test_headers['Authorization'] = f'Bearer {self.admin_token}'
        elif not use_admin_token and self.client_token:
            test_headers['Authorization'] = f'Bearer {self.client_token}'
        
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

    def test_admin_login(self):
        """Test admin login with provided credentials"""
        admin_user = os.environ.get("ADMIN_USERNAME", "admin")
        admin_pass = os.environ.get("ADMIN_PASSWORD", "admin123")
        login_data = {
            "username": admin_user,
            "password": admin_pass
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "/admins/login",
            200,
            data=login_data,
            use_admin_token=False
        )
        if not success:
            login_data["password"] = "admin123"
            success, response = self.run_test(
                "Admin Login (fallback)",
                "POST",
                "/admins/login",
                200,
                data=login_data,
                use_admin_token=False
            )
        
        if success and 'token' in response:
            self.admin_token = response['token']
            print(f"   🔑 Admin token obtained: {self.admin_token[:20]}...")
            return True
        return False

    def test_get_all_clients(self):
        """Test getting all clients (admin endpoint)"""
        success, response = self.run_test(
            "Get All Clients",
            "GET",
            "/admin/clients",
            200
        )
        return success, response

    def test_create_client(self):
        """Test creating a new client with all fields"""
        # Generate unique email to avoid conflicts
        unique_id = str(uuid.uuid4())[:8]
        
        client_data = {
            "name": f"Test Client {unique_id}",
            "email": f"testclient{unique_id}@example.com",
            "password": "testpassword123",
            "company": f"Test Company {unique_id}",
            "phone": "+1234567890",
            "is_active": True
        }
        
        success, response = self.run_test(
            "Create New Client",
            "POST",
            "/admin/clients",
            201,
            data=client_data
        )
        
        if success and 'id' in response:
            self.created_client_id = response['id']
            print(f"   📝 Created client ID: {self.created_client_id}")
            # Store client credentials for later login test
            self.test_client_email = client_data['email']
            self.test_client_password = client_data['password']
            return True, response
        return False, response

    def test_get_client_by_id(self):
        """Test getting specific client by ID"""
        if not self.created_client_id:
            return False, {"error": "No client ID available"}
            
        success, response = self.run_test(
            "Get Client by ID",
            "GET",
            f"/admin/clients/{self.created_client_id}",
            200
        )
        return success, response

    def test_update_client(self):
        """Test updating client information"""
        if not self.created_client_id:
            return False, {"error": "No client ID available"}
            
        update_data = {
            "company": "Updated Test Company",
            "phone": "+9876543210"
        }
        
        success, response = self.run_test(
            "Update Client",
            "PUT",
            f"/admin/clients/{self.created_client_id}",
            200,
            data=update_data
        )
        return success, response

    def test_get_all_client_projects(self):
        """Test getting all client projects"""
        success, response = self.run_test(
            "Get All Client Projects",
            "GET",
            "/admin/client-projects",
            200
        )
        return success, response

    def test_create_client_project(self):
        """Test creating a new project and assigning to client"""
        if not self.created_client_id:
            return False, {"error": "No client ID available"}
            
        # Calculate expected delivery date (30 days from now)
        expected_delivery = (datetime.now() + timedelta(days=30)).date()
        
        project_data = {
            "name": f"Test Project for Client {self.created_client_id[:8]}",
            "client_id": self.created_client_id,
            "description": "This is a test project created during automated testing to verify client project assignment functionality.",
            "status": "pending",
            "progress": 0,
            "expected_delivery": expected_delivery.isoformat(),
            "notes": "Initial project setup. Client will be notified of project details and timeline."
        }
        
        success, response = self.run_test(
            "Create Client Project",
            "POST",
            "/admin/client-projects",
            201,
            data=project_data
        )
        
        if success and 'id' in response:
            self.created_project_id = response['id']
            print(f"   📋 Created project ID: {self.created_project_id}")
            return True, response
        return False, response

    def test_get_project_by_id(self):
        """Test getting specific project by ID"""
        if not self.created_project_id:
            return False, {"error": "No project ID available"}
            
        success, response = self.run_test(
            "Get Project by ID",
            "GET",
            f"/admin/client-projects/{self.created_project_id}",
            200
        )
        return success, response

    def test_update_client_project(self):
        """Test updating project information"""
        if not self.created_project_id:
            return False, {"error": "No project ID available"}
            
        update_data = {
            "status": "in_progress",
            "progress": 25,
            "notes": "Project has been started. Initial development phase is underway."
        }
        
        success, response = self.run_test(
            "Update Client Project",
            "PUT",
            f"/admin/client-projects/{self.created_project_id}",
            200,
            data=update_data
        )
        return success, response

    def test_client_login(self):
        """Test client login with created credentials"""
        if not hasattr(self, 'test_client_email'):
            return False, {"error": "No client credentials available"}
            
        login_data = {
            "email": self.test_client_email,
            "password": self.test_client_password
        }
        
        success, response = self.run_test(
            "Client Login",
            "POST",
            "/client/login",
            200,
            data=login_data,
            use_admin_token=False
        )
        
        if success and 'token' in response:
            self.client_token = response['token']
            print(f"   🔑 Client token obtained: {self.client_token[:20]}...")
            return True, response
        return False, response

    def test_client_view_projects(self):
        """Test client viewing their assigned projects"""
        if not self.client_token:
            return False, {"error": "No client token available"}
            
        success, response = self.run_test(
            "Client View Projects",
            "GET",
            "/client/projects",
            200,
            use_admin_token=False
        )
        
        # Verify the created project is in the response
        if success and isinstance(response, list):
            project_found = any(p.get('id') == self.created_project_id for p in response)
            if project_found:
                print(f"   ✅ Client can see assigned project: {self.created_project_id}")
            else:
                print(f"   ⚠️  Created project not found in client's project list")
                
        return success, response

    def cleanup_test_data(self):
        """Clean up created test data"""
        print("\n🧹 Cleaning up test data...")
        
        # Delete created project
        if self.created_project_id:
            self.run_test(
                "Delete Test Project",
                "DELETE",
                f"/admin/client-projects/{self.created_project_id}",
                200
            )
        
        # Delete created client
        if self.created_client_id:
            self.run_test(
                "Delete Test Client",
                "DELETE",
                f"/admin/clients/{self.created_client_id}",
                200
            )

    def run_all_tests(self):
        """Run comprehensive client management test suite"""
        print("🚀 Starting Client Management & Project Assignment API Tests")
        print("=" * 70)
        
        # Step 1: Admin Authentication
        if not self.test_admin_login():
            print("❌ Admin authentication failed. Stopping tests.")
            return False
        
        # Step 2: Client Management Tests
        print("\n👤 Testing Client Management...")
        self.test_get_all_clients()
        
        client_created, _ = self.test_create_client()
        if not client_created:
            print("❌ Client creation failed. Stopping tests.")
            return False
            
        self.test_get_client_by_id()
        self.test_update_client()
        
        # Step 3: Project Management Tests
        print("\n📋 Testing Project Management...")
        self.test_get_all_client_projects()
        
        project_created, _ = self.test_create_client_project()
        if not project_created:
            print("❌ Project creation failed. Continuing with other tests...")
        else:
            self.test_get_project_by_id()
            self.test_update_client_project()
        
        # Step 4: Client Dashboard Tests
        print("\n🏠 Testing Client Dashboard Access...")
        client_login_success, _ = self.test_client_login()
        if client_login_success:
            self.test_client_view_projects()
        
        # Step 5: Cleanup
        self.cleanup_test_data()
        
        # Print summary
        print("\n" + "=" * 70)
        print("📊 CLIENT MANAGEMENT TEST SUMMARY")
        print("=" * 70)
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
    tester = ClientManagementTester()
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
    
    results_path = os.path.join(os.path.dirname(__file__), 'client_management_test_results.json')
    with open(results_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())