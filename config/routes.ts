export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	
	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/quan-ly-clb',
		name: 'Quản lý Câu lạc bộ',
		icon: 'TeamOutlined',
		routes: [
			{
				path: '/quan-ly-clb/cau-lac-bo',
				name: 'Danh sách CLB',
				component: './QuanLyCauLacBo/CauLacBo',
			},
			{
				path: '/quan-ly-clb/don-dang-ky',
				name: 'Đơn đăng ký',
				component: './QuanLyCauLacBo/DonDangKy',
			},
			{
				path: '/quan-ly-clb/thanh-vien',
				name: 'Thành viên CLB',
				component: './QuanLyCauLacBo/ThanhVien',
			},
			{
				path: '/quan-ly-clb/bao-cao',
				name: 'Báo cáo thống kê',
				component: './QuanLyCauLacBo/BaoCao',
			},
		]
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
