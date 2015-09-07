<?php defined( 'ABSPATH' ) or die;

/**
 * PlusWP Check
 *
 * Check PlusWP products compatibility with your current WordPress setup.
 *
 * @package           PWP_Check
 *
 * @wordpress-plugin
 * Plugin Name:       PlusWP Check
 * Plugin URI:        http://pluswp.com/check
 * Description:       Check PlusWP products compatibility with your current WordPress setup.
 * Version:           0.0.1
 * Author:            PlusWP
 * Author URI:        http://pluswp.com
 * License:           GPLv2 or later (license.txt)
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       pwpch
 * Domain Path:       /languages
 */

define( 'PWPch_PLUGIN_FILE', __FILE__ );
define( 'PWPch_PLUGIN_VERSION', '0.0.1' );
define( 'PWPch_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'PWPch_PLUGIN_URL', plugin_dir_url( __FILE__ ) );


/**
 * Short description for class
 *
 * @package    PWP_Check
 * @author     PlusWP <dev@pluswp.com> (http://pluswp.com)
 * @copyright  2015 PlusWP (kunderi kuus)
 * @license    GPL-2.0+
 * @version    Release: 0.0.1
 * @link       http://pluswp.com/customize-plus
 */
final class PWP_Check {

	/**
	 * Minimum php version supported
	 *
	 * @since 0.0.1
	 * @var array
	 */
	public static $to_check = array(
		'customize-plus' => array(
			'name' => 'Customize Plus',
			'uri' => 'http://pluswp.com/customize-plus/',
			'type' => 'plugin',
			'min_php_version' => '5.2.4',
			'min_wp_version' => '4.3.0',
			'incompatible_plugins' => array(
				array(
					'title' => 'Kirki Framework',
					'file' => 'kirki/kirki.php',
				),
			),
		),
		'customize-plus-premium' => array(
			'name' => 'Customize Plus Premium',
			'uri' => 'http://pluswp.com/customize-plus-premium/',
			'type' => 'plugin',
			'min_php_version' => '5.2.4',
			'min_wp_version' => '4.3.0',
			'upload_dir_writable' => true,
			'incompatible_plugins' => array(
				array(
					'title' => 'Kirki Framework',
					'file' => 'kirki/kirki.php',
				),
			),
		),
		'plus-bootstrap' => array(
			'name' => 'Plus Bootstrap',
			'uri' => 'http://pluswp.com/plus-bootstrap/',
			'type' => 'theme',
			'min_php_version' => '5.2.4',
			'min_wp_version' => '4.3.0',
			'incompatible_plugins' => array(
				array(
					'title' => 'Kirki Framework',
					'file' => 'kirki/kirki.php',
				),
			),
		),
	);

	/**
	 * Constructor
	 *
	 * @since 0.0.1
	 */
	public function __construct() {
		// Translate plugin meta
		__( 'Check PlusWP products compatibility with your current WordPress setup.', 'pwpch' );

		if ( is_admin() ) {
			add_action( 'admin_notices', array( __CLASS__, 'show_notice' ) );
			add_action( 'admin_enqueue_scripts', array( __CLASS__, 'print_style' ) );
			add_filter( 'plugin_row_meta', array( __CLASS__, 'meta_links' ), 10, 2 );
		}

		add_action( 'plugins_loaded', array( __CLASS__, 'init' ) );

		register_activation_hook( PWPch_PLUGIN_FILE, array( __CLASS__, 'activation' ) );
		register_activation_hook( PWPch_PLUGIN_FILE, array( __CLASS__, 'deactivation' ) );
	}

	/**
	 * Init
	 * {@link(http://geertdedeckere.be/article/loading-wordpress-language-files-the-right-way, link)}
	 *
	 * @since  0.0.1
	 */
	public static function init() {
		// The "plugin_locale" filter is also used in load_plugin_textdomain()
		$locale = apply_filters( 'plugin_locale', get_locale(), 'pwpch' );

		// Make plugin available for translation
		load_textdomain( 'pwpch', WP_LANG_DIR . '/pluswp-check/pwpch-' . $locale . '.mo' );
		load_plugin_textdomain( 'pwpch', false, dirname( plugin_basename( PWPch_PLUGIN_FILE ) ) . '/languages/' );
	}

	/**
	 * Add plugin meta links
	 *
	 * @since  0.0.1
	 * @param  array  $links Links array in which we would prepend our link.
	 * @param  string $file  Plugin file name
	 */
	public static function meta_links( $links, $file ) {
		// Check plugin
		if ( $file === plugin_basename( PWPch_PLUGIN_FILE ) ) {
			unset( $links[2] );
			$links[] = '<a href="http://pluswp.com/pluswp-check" target="_blank">' . __( 'Project homepage', 'pwpch' ) . '</a>';
		}
		return $links;
	}

	/**
	 * Activation
	 *
	 * @since  0.0.1
	 */
	public static function activation() {
		do_action( 'PWPch/activation' );
	}

	/**
	 * Deactivation
	 *
	 * @since  0.0.1
	 */
	public static function deactivation() {
		do_action( 'PWPch/deactivation' );
	}

	/**
	 * Check version (php, WordPress)
	 *
	 * @since  0.0.1
	 * @param  string $min_version Minimum supported version
	 * @param  string $of 				 Either `'php'` or '`wp'`.
	 * @return string|boolean
	 */
	public static function check_version( $min_version = '', $of = 'php' ) {
		if ( $of === 'php' ) {
			$current_version = phpversion();
			$error_msg = sprintf( __( 'PHP version %1$s is too low, %2$s is required.', 'pwpch' ), $current_version, $min_version );
		} else {
			$current_version = get_bloginfo( 'version' );
			$error_msg = sprintf( __( 'WordPress version %1$s currently installed is too low, %2$s is required.', 'pwpch' ), $current_version, $min_version );
		}

		load_plugin_textdomain( 'pwpch', false, dirname( plugin_basename( PWPch_PLUGIN_FILE ) ), '/languages/' );

		// WordPress version is too low
		if ( version_compare( $min_version, $current_version, '>' ) ) {
			return $error_msg;
		} else {
			return false;
		}
	}

	/**
	 * Check plugin incompatibilities
	 *
	 * @since  0.0.1
	 * @param  array $incompatible_plugins A list of incompatible plugins
	 * @return array
	 */
	public static function check_incompatible_plugins( $incompatible_plugins = array() ) {
		$messages = array();

		if ( is_array( $incompatible_plugins ) && ! empty( $incompatible_plugins ) ) {
			foreach ( $incompatible_plugins as $plugin ) {
				$msg = self::is_plugin_installed( $plugin['file'], $plugin['title'] );
				if ( $msg ) {
					array_push( $messages, $msg );
				}
			}
			return $messages;
		} else {
			return array();
		}
	}

	/**
	 * Is plugin installed
	 *
	 * @since  0.0.1
	 * @param  string  $probable_file  Probable file name of the plugin to search.
	 * @param  string  $probable_title Probable title of the plugin to search for.
	 * @return string|false False if the plugin is not present, an error message
	 *                      if it is.
	 */
	public static function is_plugin_installed( $probable_file, $probable_title ) {
		$msg_active = array(
			'type' => 'error',
			/* translators: %s: plugin name */
			'text' => sprintf( __( 'The plugin %s (currently active) is not compatible.', 'pwpch' ), '<b>' . $probable_title . '</b>' ),
		);
		$msg_inactive = array(
			'type' => 'warning',
			/* translators: %s: plugin name */
			'text' => sprintf( __( 'The plugin %s, which is currently inactive, is not compatible.', 'pwpch' ), '<b>' . $probable_title . '</b>' ),
		);

		// if the plugin is active
		if ( is_plugin_active( $probable_file ) ) {
			return $msg_active;
		}
		// If the plugin is active but not in the usual place, look through all active plugins
		$active_plugins = (array) get_option( 'active_plugins', array() );
		foreach ( $active_plugins as $plugin ) {
			$data = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin );
			if ( $data['Name'] == $probable_title ) {
				return $msg_active;
			}
		}

		// if the plugin is installed but not activated
		$all_plugins = get_plugins();
		if ( array_key_exists( $probable_file, $all_plugins ) ) {
			return $msg_inactive;
		}

		return false;
	}

	/**
	 * Show admin notice report
	 *
	 * @since 0.0.1
	 */
	public static function show_notice() {
		?>
		<div class="updated pwpch">
			<img src="<?php echo PWPch_PLUGIN_URL . 'logo.png'; ?>" alt="PlusWP logo" width="65" height="65">
			<h2 class="pwpch-title">
				<?php
					/* translators: %s: plugin name */
					esc_attr_e( sprintf( __( '%s report', 'pwpch' ), 'PlusWP Check' ) );
				?>
			</h2>
			<h3 class="pwpch-desc">
				<?php
					/* translators: %s: plugin name */
					esc_attr_e( sprintf( __( 'Listed here are all %s products with information about the compatibility of each product with your current WordPress and server configuration.', 'pwpch' ), 'PlusWP' ) );
				?>
			</h3>
			<?php
				global $context, $page, $s;
				$plugin_file = 'pluswp-check/pluswp-check.php';
				$output = '';

				foreach ( self::$to_check as $args ) {
					$has_errors = false;
					$has_warnings = false;
					$output_messages = '';
					$icon_error = '<i class="dashicons dashicons-no"></i> ';
					$icon_warning = '<i class="dashicons dashicons-marker warning"></i> ';

					if ( $wp_error = self::check_version( $args['min_wp_version'] ) ) {
						$output_messages .= $icon_error . $wp_error;
					}

					if ( $php_error = self::check_version( $args['min_php_version'] ) ) {
						$output_messages .= $icon_error . $php_error;
					}

					$plugin_msgs = self::check_incompatible_plugins( $args['incompatible_plugins'] );
					foreach ( $plugin_msgs as $msg ) {
						if ( $msg['type'] === 'error' ) {
							$has_errors = true;
							$output_messages .= '<p>' . $icon_error . $msg['text'] . '</p>';
						}
						if ( $msg['type'] === 'warning' ) {
							$has_warnings = true;
							$output_messages .= '<p>' . $icon_warning . $msg['text'] . '</p>';
						}
					}

					$upload_dir = wp_upload_dir()['basedir'];
					if ( isset( $args['upload_dir_writable'] ) && $args['upload_dir_writable'] && ! wp_is_writable( $upload_dir ) ) {
						$has_errors = true;
						$output_messages .= '<p>' . $icon_error . sprintf( __( 'The filepath %s needs to be writable.', 'pwpch' ), '<code>' . $upload_dir . '</code>' ) . '</p>';
					}

					if ( $has_errors ) {
						$result = array( 'icon' => 'no', 'text' => __( 'Not compatible', 'pwpch' ) );
					} else if ( $has_warnings ) {
						$result = array( 'icon' => 'yes warning', 'text' => __( 'Compatible but be careful', 'pwpch' ) );
					} else {
						$result = array( 'icon' => 'yes', 'text' => __( 'Fully compatible', 'pwpch' ) );
					}

					$output .= '<h4 class="pwpch-name">
						<i class="pwpch-symbol dashicons dashicons-' . $result['icon'] . '"></i> ' . $args['name'] . ' <small>(' . $args['type'] . ' ) | <a href="' . $args['uri'] . '" target="_blank">' . __( 'Details', 'pwpch' ) . '<i class="dashicons dashicons-external"></i></a> | <em>' . $result['text'] . '</em></small>
					</h4>';

					$output .= $output_messages;
				}

				if ( current_user_can( 'delete_plugins' ) ) {
					/* translators: %s: plugin name */
					$output .= '<a href="' . wp_nonce_url( 'plugins.php?action=deactivate&amp;plugin=' . $plugin_file . '&amp;plugin_status=' . $context . '&amp;paged=' . $page . '&amp;s=' . $s . '#pluswp-check', 'deactivate-plugin_' . $plugin_file ) . '" class="button button-primary" aria-label="' . esc_attr( sprintf( __( 'Deactivate %s', 'pwpch' ), 'PlusWP Check' ) ) . '">' . esc_attr( sprintf( __( 'Deactivate %s now', 'pwpch' ), 'PlusWP Check' ) ) . '</a>';
				}
				echo $output;
			?>
		</div>
		<?php
	}

	/**
	 * Print some css
	 */
	public static function print_style() {
		?>
		<style>
			.plugins-php #message {
				display: none;
			}
			.pwpch.updated {
				padding: 30px;
				border-color: #464646;
			}
			@media screen and (max-width: 782px) {
				.wrap .pwpch.updated {
					padding: 20px;
				}
			}
			.pwpch img {
				float: left;
				margin: 0 20px 30px 0;
			}
			.wrap .pwpch-title {
				font-size: 30px;
				font-weight: 100;
				margin: 0;
				padding: 0;
			}
			.pwpch .pwpch-desc {
				font-size: 16px;
				font-weight: 100;
				clear: none;
			}
			.pwpch .pwpch-name {
				margin: 20px 0 5px;
				font-size: 16px;
				clear: both;
				background-color: #fafafa;
				padding: 6px;
				border-radius: 3px;
			}
			.pwpch-name small {
				font-weight: 100;
			}
			.pwpch-symbol.dashicons {
		    display: inline-block;
		    width: 12px;
	      height: 12px;
		    line-height: 13px;
		    padding: 3px 6px 3px 0;
		    margin-right: 5px;
		    border-radius: 13px;
		    font-size: 17px;
		    text-align: center;
		    opacity: .7;
				color: #fff;
			}
			.pwpch-name a {
				font-weight: bold;
			}
			.pwpch-name a .dashicons {
				padding-left: 3px;
    		font-size: 19px;
			}
			.pwpch-symbol.dashicons-no {
				background: #dd3d36;
			}
			.pwpch p .dashicons {
		    color: #999;
		    margin-left: 20px;
		    font-size: 15px;
		    line-height: 19px;
		  }
		  .pwpch p:hover .dashicons {
		    color: #dd3d36;
		  }
			.pwpch-symbol.dashicons-yes.warning {
				background: #ffba00;
			}
		  .pwpch p:hover .dashicons.warning {
		    color: #ffba00;
		  }
			.pwpch-symbol.dashicons-yes {
				background: #7ad03a;
			}
			.wp-core-ui .pwpch .button {
				margin: 20px 0 0;
				text-decoration: none !important;
			}
		</style>
		<?php
	}
}

// Instantiate
new PWP_Check;