import { useState } from "react";
import { 
  Users, 
  UserPlus, 
  FileText, 
  Award, 
  Calendar, 
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Plus,
  Download,
  TrendingUp,
  User,
  Fingerprint,
  MapPinCheck,
  Clock,
  AlertCircle,
  CheckSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// OT Calculation Constants (IT Industry Standards)
const OT_CONFIG = {
  MONTHLY_WORKING_DAYS: 26,
  DAILY_WORKING_HOURS: 9,
  WEEKDAY_OT_RATE: 1.5,
  WEEKEND_OT_RATE: 2.0,
  HOLIDAY_OT_RATE: 2.0,
  MAX_OT_PER_DAY: 4,
  MAX_OT_PER_MONTH: 50
};

// OT Calculation Functions
const calculateDailyWage = (grossSalary: number) => {
  return grossSalary / OT_CONFIG.MONTHLY_WORKING_DAYS;
};

const calculateHourlyWage = (grossSalary: number) => {
  const dailyWage = calculateDailyWage(grossSalary);
  return dailyWage / OT_CONFIG.DAILY_WORKING_HOURS;
};

const calculateOTAmount = (grossSalary: number, otHours: number, otType: "weekday" | "weekend" | "holiday" = "weekday") => {
  const hourlyWage = calculateHourlyWage(grossSalary);
  const rateFactor = otType === "weekday" ? OT_CONFIG.WEEKDAY_OT_RATE : (otType === "holiday" ? OT_CONFIG.HOLIDAY_OT_RATE : OT_CONFIG.WEEKEND_OT_RATE);
  return hourlyWage * otHours * rateFactor;
};

// Mock Data
const initialEmployees = [
  { id: "EMP001", name: "Sarah Johnson", role: "Senior Developer", department: "Engineering", status: "Active", email: "sarah@tassos.com", phone: "+1-234-567-8901", location: "New York", grossSalary: 85000, basicSalary: 50000, hra: 12750, avatar: "SJ", joinDate: "2020-01-15" },
  { id: "EMP002", name: "Michael Chen", role: "Product Manager", department: "Product", status: "Active", email: "michael@tassos.com", phone: "+1-234-567-8902", location: "San Francisco", grossSalary: 92000, basicSalary: 54000, hra: 13860, avatar: "MC", joinDate: "2019-06-20" },
  { id: "EMP003", name: "Jessica Williams", role: "HR Specialist", department: "Human Resources", status: "Active", email: "jessica@tassos.com", phone: "+1-234-567-8903", location: "Boston", grossSalary: 65000, basicSalary: 38000, hra: 9880, avatar: "JW", joinDate: "2021-03-10" },
  { id: "EMP004", name: "David Miller", role: "Sales Director", department: "Sales", status: "Active", email: "david@tassos.com", phone: "+1-234-567-8904", location: "Chicago", grossSalary: 95000, basicSalary: 56000, hra: 14250, avatar: "DM", joinDate: "2018-11-05" },
  { id: "EMP005", name: "Emily Davis", role: "Marketing Lead", department: "Marketing", status: "Active", email: "emily@tassos.com", phone: "+1-234-567-8905", location: "Los Angeles", grossSalary: 75000, basicSalary: 44000, hra: 11250, avatar: "ED", joinDate: "2020-07-22" },
];

const initialAttendance = [
  { id: 1, employeeId: "EMP001", date: "2025-11-26", checkIn: "08:45", checkOut: "17:30", hours: 8.75, method: "Biometric", location: "New York Office - Main Entrance" },
  { id: 2, employeeId: "EMP002", date: "2025-11-26", checkIn: "09:00", checkOut: "17:45", hours: 8.75, method: "Web Check-in", location: "San Francisco Office - Remote" },
  { id: 3, employeeId: "EMP003", date: "2025-11-26", checkIn: "08:30", checkOut: "17:00", hours: 8.5, method: "Mobile App", location: "Boston Office - Conference Room" },
  { id: 4, employeeId: "EMP004", date: "2025-11-26", checkIn: "08:55", checkOut: "17:20", hours: 8.42, method: "Biometric", location: "Chicago Office - Main Gate" },
  { id: 5, employeeId: "EMP005", date: "2025-11-26", checkIn: "09:10", checkOut: "18:00", hours: 8.83, method: "Mobile App", location: "Los Angeles Office - Parking Lot" },
];

const initialShifts = [
  { id: 1, name: "Morning Shift", start: "08:00", end: "16:00", employees: 45 },
  { id: 2, name: "Evening Shift", start: "16:00", end: "00:00", employees: 32 },
  { id: 3, name: "Night Shift", start: "00:00", end: "08:00", employees: 18 },
];

const initialHolidays = [
  { id: 1, name: "New Year", date: "2026-01-01", type: "National" },
  { id: 2, name: "Independence Day", date: "2026-07-04", type: "National" },
  { id: 3, name: "Thanksgiving", date: "2026-11-26", type: "National" },
  { id: 4, name: "Christmas", date: "2026-12-25", type: "National" },
];

const initialOvertimes = [
  { id: 1, employeeId: "EMP001", date: "2025-11-20", hours: 2.5, approvalStatus: "Approved", otType: "weekday" },
  { id: 2, employeeId: "EMP004", date: "2025-11-21", hours: 3.0, approvalStatus: "Pending", otType: "weekday" },
  { id: 3, employeeId: "EMP005", date: "2025-11-22", hours: 1.5, approvalStatus: "Approved", otType: "weekend" },
  { id: 4, employeeId: "EMP002", date: "2025-11-23", hours: 2.0, approvalStatus: "Approved", otType: "weekday" },
  { id: 5, employeeId: "EMP003", date: "2025-11-24", hours: 3.5, approvalStatus: "Approved", otType: "holiday" },
];

export default function HRMS() {
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState(initialEmployees);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [shifts, setShifts] = useState(initialShifts);
  const [holidays, setHolidays] = useState(initialHolidays);
  const [overtimes, setOvertimes] = useState(initialOvertimes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Software Developer",
    department: "Engineering",
    location: "",
    grossSalary: "",
    basicSalary: "",
    hra: "",
  });
  const { toast } = useToast();

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewEmployeeDetail = (employee: any) => {
    setSelectedEmployee(employee);
    setIsDetailOpen(true);
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.phone || !newEmployee.location || !newEmployee.grossSalary || !newEmployee.basicSalary) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newEmp = {
      id: `EMP${String(employees.length + 1).padStart(3, "0")}`,
      name: newEmployee.name,
      role: newEmployee.role,
      department: newEmployee.department,
      status: "Active",
      email: newEmployee.email,
      phone: newEmployee.phone,
      location: newEmployee.location,
      grossSalary: parseInt(newEmployee.grossSalary),
      basicSalary: parseInt(newEmployee.basicSalary),
      hra: parseInt(newEmployee.hra) || 0,
      avatar: newEmployee.name.split(" ").map(n => n[0]).join(""),
      joinDate: new Date().toISOString().split("T")[0]
    };

    setEmployees([...employees, newEmp]);
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      role: "Software Developer",
      department: "Engineering",
      location: "",
      grossSalary: "",
      basicSalary: "",
      hra: "",
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: `Employee ${newEmp.name} added successfully`,
    });
  };

  const getEmployeeName = (empId: string) => {
    return employees.find(e => e.id === empId)?.name || "Unknown";
  };

  const getEmployeeSalary = (empId: string) => {
    return employees.find(e => e.id === empId)?.grossSalary || 0;
  };

  // Calculate OT statistics
  const totalOTHours = overtimes.reduce((sum, ot) => sum + ot.hours, 0);
  const approvedOTHours = overtimes.filter(ot => ot.approvalStatus === "Approved").reduce((sum, ot) => sum + ot.hours, 0);
  const pendingOTHours = overtimes.filter(ot => ot.approvalStatus === "Pending").reduce((sum, ot) => sum + ot.hours, 0);
  const totalOTAmount = overtimes.reduce((sum, ot) => sum + calculateOTAmount(getEmployeeSalary(ot.employeeId), ot.hours, ot.otType as any), 0);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">HR Management & Attendance</h1>
          <p className="text-muted-foreground">Manage employees, attendance tracking, and payroll operations.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <Button asChild>
            <DialogTrigger>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </DialogTrigger>
          </Button>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Fill in the employee details below</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input 
                    id="name"
                    placeholder="Full Name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="name@tassos.com"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input 
                    id="phone"
                    placeholder="+1-234-567-8900"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input 
                    id="location"
                    placeholder="City, State"
                    value={newEmployee.location}
                    onChange={(e) => setNewEmployee({...newEmployee, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee({...newEmployee, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software Developer">Software Developer</SelectItem>
                      <SelectItem value="Senior Developer">Senior Developer</SelectItem>
                      <SelectItem value="Product Manager">Product Manager</SelectItem>
                      <SelectItem value="HR Specialist">HR Specialist</SelectItem>
                      <SelectItem value="Sales Director">Sales Director</SelectItem>
                      <SelectItem value="Marketing Lead">Marketing Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={newEmployee.department} onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grossSalary">Gross Salary *</Label>
                  <Input 
                    id="grossSalary"
                    type="number"
                    placeholder="85000"
                    value={newEmployee.grossSalary}
                    onChange={(e) => setNewEmployee({...newEmployee, grossSalary: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basicSalary">Basic Salary *</Label>
                  <Input 
                    id="basicSalary"
                    type="number"
                    placeholder="50000"
                    value={newEmployee.basicSalary}
                    onChange={(e) => setNewEmployee({...newEmployee, basicSalary: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hra">HRA</Label>
                  <Input 
                    id="hra"
                    type="number"
                    placeholder="10000"
                    value={newEmployee.hra}
                    onChange={(e) => setNewEmployee({...newEmployee, hra: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddEmployee}>Add Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="employees" className="w-full flex-1 flex flex-col" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b bg-transparent p-0 h-auto rounded-none overflow-x-auto">
          <TabsTrigger 
            value="employees" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Employees
          </TabsTrigger>
          <TabsTrigger 
            value="biometric" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 whitespace-nowrap"
          >
            Biometric / RFID
          </TabsTrigger>
          <TabsTrigger 
            value="checkin" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 whitespace-nowrap"
          >
            Web & Mobile Check-in
          </TabsTrigger>
          <TabsTrigger 
            value="shifts" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Shift Scheduling
          </TabsTrigger>
          <TabsTrigger 
            value="overtime" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Overtime Calculation
          </TabsTrigger>
          <TabsTrigger 
            value="holidays" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Holiday Calendar
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 mt-6">
          {/* Employees Tab */}
          <TabsContent value="employees" className="m-0 h-full flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search employees..."
                  className="pl-9 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{employee.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-xs text-muted-foreground">{employee.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {employee.department}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.status === "Active" ? "default" : "destructive"} className={employee.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewEmployeeDetail(employee)}
                        >
                          <User className="h-4 w-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Biometric / RFID Tab */}
          <TabsContent value="biometric" className="m-0 flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-blue-50/50 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Fingerprint className="h-4 w-4" /> Biometric Devices</CardTitle>
                </CardHeader>
                <CardContent><div className="text-3xl font-bold">12</div><p className="text-xs text-muted-foreground">Active across locations</p></CardContent>
              </Card>
              <Card className="bg-emerald-50/50 border-emerald-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Verified Today</CardTitle>
                </CardHeader>
                <CardContent><div className="text-3xl font-bold">2,145</div><p className="text-xs text-muted-foreground">Unique fingerprints</p></CardContent>
              </Card>
              <Card className="bg-amber-50/50 border-amber-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Failed Attempts</CardTitle>
                </CardHeader>
                <CardContent><div className="text-3xl font-bold">8</div><p className="text-xs text-muted-foreground">Requires investigation</p></CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Biometric Enrollment Status</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>RFID Tag</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell className="font-mono text-sm">RFID-{emp.id}</TableCell>
                      <TableCell>{emp.joinDate}</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-500">Enrolled</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Web & Mobile Check-in Tab */}
          <TabsContent value="checkin" className="m-0 flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-purple-50/50 border-purple-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Today's Check-ins</CardTitle>
                </CardHeader>
                <CardContent><div className="text-3xl font-bold">{attendance.length}</div><p className="text-xs text-muted-foreground">Recorded entries</p></CardContent>
              </Card>
              <Card className="bg-cyan-50/50 border-cyan-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Avg Check-in Time</CardTitle>
                </CardHeader>
                <CardContent><div className="text-3xl font-bold">08:47</div><p className="text-xs text-muted-foreground">AM arrival</p></CardContent>
              </Card>
              <Card className="bg-pink-50/50 border-pink-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Late Arrivals</CardTitle>
                </CardHeader>
                <CardContent><div className="text-3xl font-bold">2</div><p className="text-xs text-muted-foreground">After 09:00 AM</p></CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Web & Mobile Check-in Log</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell className="font-medium">{getEmployeeName(rec.employeeId)}</TableCell>
                      <TableCell>{rec.checkIn}</TableCell>
                      <TableCell>{rec.checkOut}</TableCell>
                      <TableCell className="text-sm text-muted-foreground"><MapPin className="h-3 w-3 inline mr-1" />{rec.location}</TableCell>
                      <TableCell>{rec.hours}h</TableCell>
                      <TableCell><Badge variant="outline">{rec.method}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Shift Scheduling Tab */}
          <TabsContent value="shifts" className="m-0 flex flex-col gap-6">
            <div className="grid gap-4">
              {shifts.map((shift) => (
                <Card key={shift.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>{shift.name}</CardTitle>
                      <CardDescription>{shift.start} - {shift.end}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{shift.employees}</div>
                      <p className="text-xs text-muted-foreground">Employees assigned</p>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline">View Assignments</Button>
                    <Button variant="outline" className="ml-2">Edit Shift</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Shift Roster</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Mon</TableHead>
                    <TableHead>Tue</TableHead>
                    <TableHead>Wed</TableHead>
                    <TableHead>Thu</TableHead>
                    <TableHead>Fri</TableHead>
                    <TableHead>Sat</TableHead>
                    <TableHead>Sun</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.slice(0, 3).map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      {['Morning', 'Evening', 'Night', 'Morning', 'Evening', 'Off', 'Off'].map((shift, i) => (
                        <TableCell key={i}>
                          <Badge variant="outline" className="text-xs">{shift}</Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Overtime Calculation Tab - WITH PROPER FORMULAS */}
          <TabsContent value="overtime" className="m-0 flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-indigo-50/50 border-indigo-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total OT Hours</CardTitle>
                </CardHeader>
                <CardContent><div className="text-3xl font-bold">{totalOTHours.toFixed(1)}</div><p className="text-xs text-muted-foreground">This month</p></CardContent>
              </Card>
              <Card className="bg-teal-50/50 border-teal-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Approved OT</CardTitle>
                </CardHeader>
                <CardContent><div className="text-3xl font-bold">{approvedOTHours.toFixed(1)}h</div><p className="text-xs text-muted-foreground">Processed</p></CardContent>
              </Card>
              <Card className="bg-yellow-50/50 border-yellow-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Pending</CardTitle>
                </CardHeader>
                <CardContent><div className="text-3xl font-bold">{pendingOTHours.toFixed(1)}h</div><p className="text-xs text-muted-foreground">Awaiting review</p></CardContent>
              </Card>
              <Card className="bg-emerald-50/50 border-emerald-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total OT Amount</CardTitle>
                </CardHeader>
                <CardContent><div className="text-3xl font-bold">${totalOTAmount.toFixed(0)}</div><p className="text-xs text-muted-foreground">To be paid</p></CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>OT Calculation Details</CardTitle>
                <CardDescription>Based on Gross Salary, {OT_CONFIG.MONTHLY_WORKING_DAYS} working days, {OT_CONFIG.DAILY_WORKING_HOURS} hours/day</CardDescription>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>OT Hours</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Gross Salary</TableHead>
                      <TableHead>Daily Wage</TableHead>
                      <TableHead>Hourly Wage</TableHead>
                      <TableHead>Rate Factor</TableHead>
                      <TableHead className="text-right">OT Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overtimes.map((ot) => {
                      const empSalary = getEmployeeSalary(ot.employeeId);
                      const dailyWage = calculateDailyWage(empSalary);
                      const hourlyWage = calculateHourlyWage(empSalary);
                      const rateFactor = ot.otType === "weekday" ? OT_CONFIG.WEEKDAY_OT_RATE : (ot.otType === "holiday" ? OT_CONFIG.HOLIDAY_OT_RATE : OT_CONFIG.WEEKEND_OT_RATE);
                      const otAmount = calculateOTAmount(empSalary, ot.hours, ot.otType as any);
                      
                      return (
                        <TableRow key={ot.id}>
                          <TableCell className="font-medium">{getEmployeeName(ot.employeeId)}</TableCell>
                          <TableCell>{ot.date}</TableCell>
                          <TableCell>{ot.hours}h</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs capitalize">
                              {ot.otType}
                            </Badge>
                          </TableCell>
                          <TableCell>${empSalary.toLocaleString()}</TableCell>
                          <TableCell>${dailyWage.toFixed(2)}</TableCell>
                          <TableCell>${hourlyWage.toFixed(2)}</TableCell>
                          <TableCell className="font-semibold">{rateFactor}x</TableCell>
                          <TableCell className="font-bold text-right">${otAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={ot.approvalStatus === "Approved" ? "bg-emerald-500" : "bg-amber-500"}>
                              {ot.approvalStatus}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>OT Calculation Formula Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-3 bg-muted/30">
                    <p className="font-semibold mb-1">Daily Wage Formula</p>
                    <p className="font-mono">= Gross Salary ÷ {OT_CONFIG.MONTHLY_WORKING_DAYS} days</p>
                  </div>
                  <div className="border rounded-lg p-3 bg-muted/30">
                    <p className="font-semibold mb-1">Hourly Wage Formula</p>
                    <p className="font-mono">= Daily Wage ÷ {OT_CONFIG.DAILY_WORKING_HOURS} hours</p>
                  </div>
                  <div className="border rounded-lg p-3 bg-muted/30">
                    <p className="font-semibold mb-1">OT Rate Factors</p>
                    <p className="text-xs">Weekday: {OT_CONFIG.WEEKDAY_OT_RATE}x | Weekend: {OT_CONFIG.WEEKEND_OT_RATE}x | Holiday: {OT_CONFIG.HOLIDAY_OT_RATE}x</p>
                  </div>
                  <div className="border rounded-lg p-3 bg-muted/30">
                    <p className="font-semibold mb-1">OT Amount Formula</p>
                    <p className="font-mono">= Hourly Wage × Hours × Rate Factor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Holiday Calendar Tab */}
          <TabsContent value="holidays" className="m-0 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Holiday Calendar 2026</CardTitle>
                <CardDescription>Upcoming public holidays and company holidays.</CardDescription>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Holiday</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holidays.map((holiday) => (
                    <TableRow key={holiday.id}>
                      <TableCell className="font-medium">{holiday.name}</TableCell>
                      <TableCell>{holiday.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{holiday.type}</Badge>
                      </TableCell>
                      <TableCell>1 day</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Balance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">20</div>
                    <div className="text-sm text-muted-foreground mt-1">Annual Leave Available</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600">12</div>
                    <div className="text-sm text-muted-foreground mt-1">Sick Leave Available</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-amber-600">5</div>
                    <div className="text-sm text-muted-foreground mt-1">Casual Leave Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Employee Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Employee Details & Salary Structure</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">{selectedEmployee.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedEmployee.role}</p>
                  <Badge className="mt-2">{selectedEmployee.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Employee ID</Label>
                  <p className="text-sm font-mono">{selectedEmployee.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Department</Label>
                  <p className="text-sm">{selectedEmployee.department}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Email</Label>
                  <p className="text-sm flex items-center gap-1"><Mail className="h-3 w-3" /> {selectedEmployee.email}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Phone</Label>
                  <p className="text-sm flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedEmployee.phone}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Location</Label>
                  <p className="text-sm flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedEmployee.location}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Join Date</Label>
                  <p className="text-sm">{selectedEmployee.joinDate}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Salary Structure</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Basic Salary</span><span className="font-semibold">${selectedEmployee.basicSalary.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>HRA (House Rent Allowance)</span><span className="font-semibold">${selectedEmployee.hra.toLocaleString()}</span></div>
                  <div className="flex justify-between border-t pt-2 mt-2"><span>Gross Salary</span><span className="font-bold text-lg">${selectedEmployee.grossSalary.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2"><span>Hourly OT Rate (Weekday)</span><span className="font-mono">${(calculateHourlyWage(selectedEmployee.grossSalary) * OT_CONFIG.WEEKDAY_OT_RATE).toFixed(2)}/hr</span></div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit Employee</Button>
                  <Button variant="outline" size="sm">View Attendance</Button>
                  <Button variant="outline" size="sm">View Payroll</Button>
                  <Button variant="destructive" size="sm">Deactivate</Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
